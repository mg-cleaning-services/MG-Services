import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
];
function errorResponse(message, status) {
  return Response.json({
    success: false,
    error: message
  }, {
    status
  });
}
export default {
  fetch: withSupabase({
    auth: "none"
  }, async (req, ctx)=>{
    try {
      // ====================================================
      // 1. Only POST requests
      // ====================================================
      if (req.method !== "POST") {
        return errorResponse("Method not allowed", 405);
      }
      // ====================================================
      // 2. Read multipart/form-data
      // ====================================================
      const formData = await req.formData();
      const token = formData.get("token");
      const applicationId = formData.get("applicationId");
      const photo = formData.get("photo");
      // ====================================================
      // 3. Validate application information
      // ====================================================
      if (typeof token !== "string" || !token.trim() || typeof applicationId !== "string" || !applicationId.trim()) {
        return errorResponse("Invalid application information", 400);
      }
      if (!(photo instanceof File)) {
        return errorResponse("Photo is required", 400);
      }
      // ====================================================
      // 4. Validate photo
      // ====================================================
      if (!ALLOWED_TYPES.includes(photo.type)) {
        return errorResponse("Only JPG, PNG and WebP images are allowed", 400);
      }
      if (photo.size <= 0) {
        return errorResponse("The selected photo is empty", 400);
      }
      if (photo.size > MAX_FILE_SIZE) {
        return errorResponse("Photo must be 5 MB or smaller", 400);
      }
      // ====================================================
      // 5. Verify token → application relationship
      //
      // The RPC is only executable by service_role.
      // ctx.supabaseAdmin provides privileged server access.
      // ====================================================
      const { data: authorized, error: verificationError } = await ctx.supabaseAdmin.rpc("verify_candidate_application_token", {
        p_token: token.trim(),
        p_application_id: applicationId.trim()
      });
      if (verificationError) {
        console.error("Candidate authorization error:", verificationError);
        return errorResponse("Could not verify application", 500);
      }
      if (authorized !== true) {
        return errorResponse("Photo upload is not authorized", 403);
      }
      // ====================================================
      // 6. Determine extension ourselves
      //
      // Do not trust the original browser filename.
      // ====================================================
      const extensionByType = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp"
      };
      const extension = extensionByType[photo.type];
      const storagePath = `${applicationId.trim()}/profile-${crypto.randomUUID()}.${extension}`;
      // ====================================================
      // 7. Upload to private candidate-photos bucket
      // ====================================================
      const { data: uploadData, error: uploadError } = await ctx.supabaseAdmin.storage.from("candidate-photos").upload(storagePath, photo, {
        contentType: photo.type,
        upsert: false
      });
      if (uploadError) {
        console.error("Candidate photo upload error:", uploadError);
        return errorResponse("Photo could not be uploaded", 500);
      }
      // ====================================================
      // 8. Save private Storage path
      //
      // photo_url stores the PRIVATE object path.
      // It is not a public URL.
      // ====================================================
      const { error: updateError } = await ctx.supabaseAdmin.from("candidate_applications").update({
        photo_url: uploadData.path
      }).eq("id", applicationId.trim());
      // ====================================================
      // 9. Cleanup Storage if DB update fails
      // ====================================================
      if (updateError) {
        console.error("Candidate photo DB update error:", updateError);
        const { error: cleanupError } = await ctx.supabaseAdmin.storage.from("candidate-photos").remove([
          uploadData.path
        ]);
        if (cleanupError) {
          console.error("Candidate photo cleanup error:", cleanupError);
        }
        return errorResponse("Photo could not be attached to application", 500);
      }
      // ====================================================
      // 10. Success
      // ====================================================
      return Response.json({
        success: true,
        applicationId: applicationId.trim()
      });
    } catch (error) {
      console.error("Unexpected candidate photo upload error:", error);
      return errorResponse("Unexpected server error", 500);
    }
  })
};
