
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, MailWarning } from "lucide-react";
import { acceptStaffInvitation } from "../services/invitations.services";

type InvitationStatus = "loading" | "success" | "error";

export default function AcceptInvitationPage() {
  const [searchParams] = useSearchParams();

  const invitationId = searchParams.get("invitation_id");
  const token = searchParams.get("token");

  const [status, setStatus] = useState<InvitationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  // Prevent duplicate requests during React Strict Mode effect replay
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    async function acceptInvitation() {
      if (!invitationId || !token) {
        setErrorMessage("The invitation link is invalid or incomplete.");
        setStatus("error");
        return;
      }

      try {
        await acceptStaffInvitation(invitationId, token);
        setStatus("success");
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong while accepting the invitation.",
        );
        setStatus("error");
      }
    }

    acceptInvitation();
  }, [invitationId, token]);

  function goToDashboard() {
    // Reload so clinic membership and active-clinic state are fetched again
    window.location.assign("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>

            <h1 className="text-xl font-semibold text-foreground">
              Accepting your invitation
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Please wait while we set up your clinic membership.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <h1 className="text-xl font-semibold text-foreground">
              Invitation accepted!
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Your clinic membership is ready. You can now access your clinic
              workspace.
            </p>

            <button
              type="button"
              onClick={goToDashboard}
              className="mt-7 w-full rounded-xl bg-brand-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-800"
            >
              Go to dashboard
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <MailWarning className="h-7 w-7" />
            </div>

            <h1 className="text-xl font-semibold text-foreground">
              Unable to accept invitation
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {errorMessage}
            </p>

            <p className="mt-4 text-xs text-muted-foreground">
              Please check your invitation link or contact the clinic
              administrator.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
