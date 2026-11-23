import { createClient } from "npm:@supabase/supabase-js@2";
Deno.serve(async (req)=>{
  const headers = {
    "Content-Type": "application/json"
  };
  // This endpoint must never be publicly callable.
  const expectedSecret = Deno.env.get("INSTAGRAM_REFRESH_JOB_SECRET");
  const providedSecret = req.headers.get("x-refresh-secret");
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return new Response(JSON.stringify({
      error: "Unauthorized"
    }), {
      status: 401,
      headers
    });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers
    });
  }
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    // Get current token from Vault
    const { data: currentToken, error: readError } = await supabase.rpc("get_instagram_access_token");
    if (readError || !currentToken) {
      throw new Error("Unable to read Instagram token");
    }
    // Request token refresh from Instagram
    const url = new URL("https://graph.instagram.com/refresh_access_token");
    url.searchParams.set("grant_type", "ig_refresh_token");
    url.searchParams.set("access_token", currentToken);
    const response = await fetch(url);
    const result = await response.json();
    if (!response.ok) {
      console.error("Instagram refresh failed", response.status, result.error?.code);
      return new Response(JSON.stringify({
        error: "Instagram rejected token refresh"
      }), {
        status: 502,
        headers
      });
    }
    if (typeof result.access_token !== "string" || !result.access_token || !Number.isSafeInteger(result.expires_in) || result.expires_in <= 0) {
      throw new Error("Invalid Instagram refresh response");
    }
    // Save refreshed token and expiry in Vault
    const { error: updateError } = await supabase.rpc("update_instagram_access_token", {
      new_token: result.access_token,
      token_expires_in: result.expires_in
    });
    if (updateError) {
      throw new Error("Unable to save refreshed token");
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Instagram token refreshed",
      expiresIn: result.expires_in
    }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error("Instagram token refresh error", error);
    return new Response(JSON.stringify({
      error: "Token refresh failed"
    }), {
      status: 500,
      headers
    });
  }
});
