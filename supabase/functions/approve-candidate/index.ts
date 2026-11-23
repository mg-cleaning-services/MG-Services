import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const CANDIDATE_BUCKET = "candidate-photos";
const EMPLOYEE_BUCKET = "employee-photo";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
Deno.serve(async (req)=>{
  let uploadedEmployeePhotoPath = null;
  // ----------------------------------------------------------
  // CORS preflight
  // ----------------------------------------------------------
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  try {
    // --------------------------------------------------------
    // Method
    // --------------------------------------------------------
    if (req.method !== "POST") {
      return jsonResponse({
        success: false,
        error: "Method not allowed."
      }, 405);
    }
    // --------------------------------------------------------
    // Environment
    // --------------------------------------------------------
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      throw new Error("Supabase environment variables are missing.");
    }
    // --------------------------------------------------------
    // Authorization
    // --------------------------------------------------------
    const authorization = req.headers.get("Authorization");
    if (!authorization) {
      return jsonResponse({
        success: false,
        error: "Authentication required."
      }, 401);
    }
    // --------------------------------------------------------
    // Authenticated user client
    // --------------------------------------------------------
    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: authorization
        }
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    // --------------------------------------------------------
    // Service-role client
    // --------------------------------------------------------
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    // --------------------------------------------------------
    // Authenticate caller
    // --------------------------------------------------------
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return jsonResponse({
        success: false,
        error: "Authentication required."
      }, 401);
    }
    // --------------------------------------------------------
    // Verify admin
    // --------------------------------------------------------
    const { data: profile, error: profileError } = await supabaseAdmin.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profileError) {
      throw profileError;
    }
    if (profile?.role !== "admin") {
      return jsonResponse({
        success: false,
        error: "Admin access required."
      }, 403);
    }
    // --------------------------------------------------------
    // Request body
    // --------------------------------------------------------
    const body = await req.json();
    const applicationId = body?.applicationId;
    if (!applicationId) {
      return jsonResponse({
        success: false,
        error: "Candidate application ID is required."
      }, 400);
    }
    // --------------------------------------------------------
    // Candidate
    // --------------------------------------------------------
    const { data: candidate, error: candidateError } = await supabaseAdmin.from("candidate_applications").select("id, status, employee_id, photo_url").eq("id", applicationId).maybeSingle();
    if (candidateError) {
      throw candidateError;
    }
    if (!candidate) {
      return jsonResponse({
        success: false,
        error: "Candidate application not found."
      }, 404);
    }
    if (candidate.status !== "submitted" || candidate.employee_id) {
      return jsonResponse({
        success: false,
        error: "Candidate application has already been reviewed."
      }, 409);
    }
    // --------------------------------------------------------
    // Generate Employee UUID
    // --------------------------------------------------------
    const employeeId = crypto.randomUUID();
    let employeePhotoUrl = null;
    // --------------------------------------------------------
    // Migrate photo
    // --------------------------------------------------------
    if (candidate.photo_url) {
      const candidatePhotoPath = candidate.photo_url;
      const { data: photoBlob, error: downloadError } = await supabaseAdmin.storage.from(CANDIDATE_BUCKET).download(candidatePhotoPath);
      if (downloadError || !photoBlob) {
        throw new Error(downloadError?.message || "Candidate photo could not be downloaded.");
      }
      const extension = getExtension(candidatePhotoPath);
      uploadedEmployeePhotoPath = `${employeeId}/profile-${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabaseAdmin.storage.from(EMPLOYEE_BUCKET).upload(uploadedEmployeePhotoPath, photoBlob, {
        contentType: photoBlob.type || getContentType(extension),
        cacheControl: "3600",
        upsert: false
      });
      if (uploadError) {
        throw uploadError;
      }
      const { data: publicUrlData } = supabaseAdmin.storage.from(EMPLOYEE_BUCKET).getPublicUrl(uploadedEmployeePhotoPath);
      employeePhotoUrl = publicUrlData?.publicUrl || null;
      if (!employeePhotoUrl) {
        throw new Error("Employee photo URL could not be generated.");
      }
    }
    // --------------------------------------------------------
    // Candidate -> Employee transaction
    // --------------------------------------------------------
    const { data: createdEmployeeId, error: approvalError } = await supabaseUser.rpc("approve_candidate_application", {
      p_application_id: applicationId,
      p_employee_id: employeeId,
      p_photo_url: employeePhotoUrl
    });
    if (approvalError) {
      // Compensating cleanup:
      // DB conversion failed, so remove the permanent photo.
      if (uploadedEmployeePhotoPath) {
        await supabaseAdmin.storage.from(EMPLOYEE_BUCKET).remove([
          uploadedEmployeePhotoPath
        ]);
        uploadedEmployeePhotoPath = null;
      }
      throw approvalError;
    }
    // --------------------------------------------------------
    // Delete temporary candidate photo
    // --------------------------------------------------------
    let temporaryPhotoRemoved = true;
    if (candidate.photo_url) {
      const { error: cleanupError } = await supabaseAdmin.storage.from(CANDIDATE_BUCKET).remove([
        candidate.photo_url
      ]);
      if (cleanupError) {
        console.error("Candidate temporary photo cleanup failed:", cleanupError);
        temporaryPhotoRemoved = false;
      }
    }
    // --------------------------------------------------------
    // Success
    // --------------------------------------------------------
    return jsonResponse({
      success: true,
      employeeId: createdEmployeeId,
      temporaryPhotoRemoved
    });
  } catch (error) {
    console.error("approve-candidate error:", error);
    return jsonResponse({
      success: false,
      error: error instanceof Error ? error.message : "Candidate could not be approved."
    }, 500);
  }
});
function getExtension(path) {
  const extension = path.split(".").pop()?.toLowerCase();
  if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "webp") {
    return extension;
  }
  return "jpg";
}
function getContentType(extension) {
  if (extension === "png") {
    return "image/png";
  }
  if (extension === "webp") {
    return "image/webp";
  }
  return "image/jpeg";
}
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
}
