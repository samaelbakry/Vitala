
import { Badge } from "@/components/ui/badge";
import type { InvitationStatusType } from "../staff.type";

interface InvitationStatusProps {
  status: InvitationStatusType;
}

const statusConfig: Record<InvitationStatusType, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
  },
  accepted: {
    label: "Accepted",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  expired: {
    label: "Expired",
    className:
      "border-muted bg-muted/60 text-muted-foreground",
  },
  revoked: {
    label: "Revoked",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400",
  },
};

export default function InvitationStatus({
  status,
}: InvitationStatusProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}
