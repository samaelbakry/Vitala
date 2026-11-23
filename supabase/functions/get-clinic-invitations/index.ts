import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const authorization = req.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      throw new Error("Missing required environment variables");
    }

    const jwt = authorization.slice(7);

    const userClient = createClient(supabaseUrl, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser(jwt);

    if (authError || !user) {
      return jsonResponse({ error: "Invalid user session" }, 401);
    }

    const body = await req.json();
    const clinicId = typeof body.clinicId === "string" ? body.clinicId : "";

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        clinicId,
      )
    ) {
      return jsonResponse({ error: "Invalid clinic ID" }, 400);
    }

    // Only active clinic admins can view invitations.
    const { data: membership, error: membershipError } = await adminClient
      .from("clinic_members")
      .select("id")
      .eq("clinic_id", clinicId)
      .eq("user_id", user.id)
      .eq("role", "admin")
      .eq("status", "active")
      .maybeSingle();

    if (membershipError) throw membershipError;

    if (!membership) {
      return jsonResponse(
        { error: "You are not an admin of this clinic" },
        403,
      );
    }

    // Mark pending invitations as expired when their expiry date has passed.
    const { error: expireError } = await adminClient
      .from("clinic_invitations")
      .update({ status: "expired" })
      .eq("clinic_id", clinicId)
      .eq("status", "pending")
      .lte("expires_at", new Date().toISOString());

    if (expireError) throw expireError;

    // Never expose token_hash to the frontend.
    const { data: invitations, error: invitationsError } = await adminClient
      .from("clinic_invitations")
      .select("id, email, role, status, expires_at, created_at")
      .eq("clinic_id", clinicId)
      .order("created_at", { ascending: false });

    if (invitationsError) throw invitationsError;

    return jsonResponse({
      success: true,
      invitations: invitations ?? [],
    });
  } catch (error) {
    console.error("get-clinic-invitations error:", error);

    return jsonResponse({ error: "Failed to load clinic invitations" }, 500);
  }
});
