
import { useState } from "react";
import { useActiveClinic } from "@/features/clinic/hooks/useActiveClinic";
import type { StaffInvitationRole } from "../staff.type";
import { inviteStaff } from "../services/invitations.services";

export default function InviteStaffTest() {
  const { activeClinicId } = useActiveClinic();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffInvitationRole>("doctor");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    if (!activeClinicId || !email.trim()) {
      setMessage("Enter an email and select an active clinic.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result = await inviteStaff({
        email,
        role,
        clinicId: activeClinicId,
      });

      setMessage(
        `Success! Invitation ID: ${result.invitationId}`
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-4 rounded-xl border p-5">
      <h2 className="text-lg font-semibold">
        Invite Staff Test
      </h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Employee email"
        className="w-full rounded-lg border p-3"
      />

      <select
        value={role}
        onChange={(e) =>
          setRole(e.target.value as StaffInvitationRole)
        }
        className="w-full rounded-lg border p-3"
      >
        <option value="doctor">Doctor</option>
        <option value="receptionist">Receptionist</option>
      </select>

      <button
        onClick={handleInvite}
        disabled={loading || !activeClinicId}
        className="rounded-lg bg-green-700 px-5 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Test Invitation"}
      </button>

      {message && (
        <p className="break-all text-sm">{message}</p>
      )}
    </div>
  );
}
