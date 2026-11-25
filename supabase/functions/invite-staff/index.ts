
import { createClient } from "npm:@supabase/supabase-js@2";

//Cross-Origin Resource Sharing
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
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

//Generate Secure Token
const generateToken = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));

  return Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
};

const hashToken = async (token: string) => {
  const encoded = new TextEncoder().encode(token);
  const hash = await crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(hash), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
};

// Authentication vs Authorization
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let invitationId: string | null = null;

  try {
    const authorization = req.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const appUrl = Deno.env.get("APP_URL");

    if (!supabaseUrl || !anonKey || !serviceRoleKey || !appUrl) {
      throw new Error("Missing required environment variables");
    }

    // access token for user
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

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const clinicId =
      typeof body.clinicId === "string"
        ? body.clinicId
        : "";

    const role = body.role;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: "Invalid email address" }, 400);
    }

    if (
      !clinicId ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        clinicId
      )
    ) {
      return jsonResponse({ error: "Invalid clinic ID" }, 400);
    }

    if (!["doctor", "receptionist"].includes(role)) {
      return jsonResponse({ error: "Invalid staff role" }, 400);
    }

    // Verify that the current user is an active admin of this clinic.
    const { data: membership, error: membershipError } =
      await adminClient
        .from("clinic_members")
        .select("id")
        .eq("clinic_id", clinicId)
        .eq("user_id", user.id)
        .eq("role", "admin")
        .eq("status", "active")
        .maybeSingle();

    if (membershipError) {
      throw membershipError;
    }

    if (!membership) {
      return jsonResponse(
        { error: "You are not an admin of this clinic" },
        403
      );
    }

    // Prevent duplicate pending invitations.
    const { data: existingInvitation, error: existingError } =
      await adminClient
        .from("clinic_invitations")
        .select("id")
        .eq("clinic_id", clinicId)
        .eq("email", email)
        .eq("status", "pending")
        .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingInvitation) {
      return jsonResponse(
        { error: "A pending invitation already exists for this email" },
        409
      );
    }

    // Create a secure invitation token.
    const rawToken = generateToken();
    const tokenHash = await hashToken(rawToken);

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    // Save the invitation.
    const { data: invitation, error: invitationError } =
      await adminClient
        .from("clinic_invitations")
        .insert({
          clinic_id: clinicId,
          email,
          role,
          invited_by: user.id,
          token_hash: tokenHash,
          expires_at: expiresAt,
        })
        .select("id")
        .single();

    if (invitationError) {
      if (invitationError.code === "23505") {
        return jsonResponse(
          { error: "A pending invitation already exists" },
          409
        );
      }

      throw invitationError;
    }

    invitationId = invitation.id;

    // Build the invitation redirect URL.
    const redirectUrl = new URL(
      "/accept-invitation",
      appUrl
    );

    redirectUrl.searchParams.set(
      "invitation_id",
      invitation.id
    );

    redirectUrl.searchParams.set("token", rawToken);

    // Send the invitation email through Supabase Auth.
    const { error: inviteError } =
      await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo: redirectUrl.toString(),
        data: {
          clinic_invitation_id: invitation.id,
        },
      });

    if (inviteError) {
      throw inviteError;
    }

    return jsonResponse({
      success: true,
      message: "Invitation sent successfully",
      invitationId: invitation.id,
    });
  } catch (error) {
    console.error("invite-staff error:", error);

    // Roll back the invitation if sending the email fails.
    if (invitationId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceRoleKey = Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY"
      );

      if (supabaseUrl && serviceRoleKey) {
        const adminClient = createClient(
          supabaseUrl,
          serviceRoleKey
        );

        const { error: deleteError } = await adminClient
          .from("clinic_invitations")
          .delete()
          .eq("id", invitationId);

        if (deleteError) {
          console.error("Invitation rollback failed:", deleteError);
        }
      }
    }

    return jsonResponse(
      { error: "Failed to send staff invitation" },
      500
    );
  }
});
