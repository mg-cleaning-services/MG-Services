import { createClient } from "npm:@supabase/supabase-js@2";
Deno.serve(async (req)=>{
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json"
  };
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers
    });
  }
  if (req.method !== "GET") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers
    });
  }
  try {
    // Create a backend-only Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Supabase configuration is missing");
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    // Retrieve the current Instagram token from Vault
    const { data: token, error: tokenError } = await supabase.rpc("get_instagram_access_token");
    if (tokenError || !token) {
      console.error("Unable to retrieve Instagram token", tokenError);
      throw new Error("Instagram token unavailable");
    }
    // Fetch Instagram posts
    const url = new URL("https://graph.instagram.com/me/media");
    url.searchParams.set("fields", "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp");
    url.searchParams.set("limit", "6");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      console.error("Instagram API request failed", response.status);
      return new Response(JSON.stringify({
        error: "Instagram API unavailable"
      }), {
        status: 502,
        headers
      });
    }
    const data = await response.json();
    const posts = (data.data ?? []).map((post)=>({
        id: post.id,
        src: post.media_type === "VIDEO" ? post.thumbnail_url || post.media_url : post.media_url,
        alt: post.caption || "MG Cleaning Instagram post",
        permalink: post.permalink,
        timestamp: post.timestamp,
        mediaType: post.media_type
      }));
    return new Response(JSON.stringify({
      posts
    }), {
      status: 200,
      headers: {
        ...headers,
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch (error) {
    console.error("Instagram feed error:", error);
    return new Response(JSON.stringify({
      error: "Unable to load Instagram feed"
    }), {
      status: 500,
      headers
    });
  }
});
