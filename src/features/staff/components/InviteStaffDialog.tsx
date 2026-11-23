import { useState } from "react";
import { Loader2, MailPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { StaffInvitationRole } from "../staff.type";
import { inviteStaff } from "../services/invitations.services";
import { useQueryClient } from "@tanstack/react-query";

interface InviteStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicId: string;
}

export default function InviteStaffDialog({
  open,
  onOpenChange,
  clinicId,
}: InviteStaffDialogProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffInvitationRole>("doctor");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  function resetForm() {
    setFullName("");
    setEmail("");
    setRole("doctor");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && !isLoading) {
      resetForm();
    }

    onOpenChange(nextOpen);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!fullName.trim() || !email.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await inviteStaff({
        fullName,
        email,
        role,
        clinicId,
      });

      toast.success("Invitation sent successfully", {
        description: `Invitation sent to ${email.trim()}`,
      });

      console.log("Invitation ID:", result.invitationId);

      resetForm();
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: ["clinic-invitations", clinicId],
      });
    } catch (error) {
      toast.error("Failed to send invitation", {
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-115">
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
            <MailPlus className="h-5 w-5" />
          </div>

          <DialogTitle>Invite staff member</DialogTitle>

          <DialogDescription>
            Send an invitation to a new doctor or receptionist to join your
            clinic.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="staff-name">Full name</Label>
            <Input
              id="staff-name"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              required
              minLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-email">Email address</Label>
            <Input
              id="staff-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-role">Role</Label>
            <select
              id="staff-role"
              value={role}
              onChange={(e) => setRole(e.target.value as StaffInvitationRole)}
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="doctor">Doctor</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send invitation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
