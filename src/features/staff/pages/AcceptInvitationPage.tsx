import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, MailWarning } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { acceptStaffInvitation } from "../services/invitations.services";

type InvitationStatus = "form" | "loading" | "success" | "error";

export default function AcceptInvitationPage() {
  const [searchParams] = useSearchParams();

  const invitationId = searchParams.get("invitation_id");
  const token = searchParams.get("token");

  const [status, setStatus] = useState<InvitationStatus>("form");
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ showPassword , setShowPassword] = useState(false)
  const [ showConfirmPassword , setShowConfirmPassword] = useState(false)
 
  useEffect(() => {
    if (!invitationId || !token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrorMessage("The invitation link is invalid or incomplete.");
      setStatus("error");
    }
  }, [invitationId, token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!invitationId || !token) {
      setErrorMessage("The invitation link is invalid or incomplete.");
      setStatus("error");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");
    setStatus("loading");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error(
          "Your invitation session is missing or has expired. Please open the invitation link again.",
        );
      }

      const { error: passwordError } = await supabase.auth.updateUser({
        password,
      });

      if (passwordError) {
        throw passwordError;
      }

      await acceptStaffInvitation(invitationId, token);
      setStatus("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while accepting the invitation.",
      );
      setStatus("form");
    }
  }

  function goToDashboard() {
    window.location.assign("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-linear-to-b from-background via-background to-muted/30 px-4 py-12 antialiased">
      <section className="w-full max-w-md overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-xl shadow-black/5 ring-1 ring-black/3 sm:p-10 dark:shadow-none dark:ring-white/5">
        {status === "form" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-700/15 dark:bg-brand-950/60 dark:text-brand-300 dark:ring-brand-400/20">
                <KeyRound className="h-6 w-6" />
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Set your password
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Create a secure password to finish accepting your clinic
                invitation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter a strong password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all outline-none focus:border-brand-700 focus:ring-4 focus:ring-brand-700/10 dark:focus:border-brand-400 dark:focus:ring-brand-400/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all outline-none focus:border-brand-700 focus:ring-4 focus:ring-brand-700/10 dark:focus:border-brand-400 dark:focus:ring-brand-400/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-3 text-sm text-destructive"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-700/20 active:scale-[0.99]"
              >
                <span>Set password and accept invitation</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {status === "loading" && (
          <div className="py-6 text-center">
            <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-700/15 dark:bg-brand-950/60 dark:text-brand-300 dark:ring-brand-400/20">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>

            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Setting up your account
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Please wait while we configure your password and activate your
              clinic membership.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Invitation accepted!
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your clinic membership is ready. You can now access your clinic
              workspace.
            </p>

            <button
              type="button"
              onClick={goToDashboard}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-700/20 active:scale-[0.99]"
            >
              <span>Go to dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/20">
              <MailWarning className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Unable to accept invitation
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {errorMessage}
            </p>

            <div className="mt-6 rounded-xl border border-border/80 bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              Please verify that your invitation link hasn&apos;t expired or
              contact your clinic administrator for a new invite.
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
