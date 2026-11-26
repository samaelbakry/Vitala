import {
  Search,
  Stethoscope,
  UserRound,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserRole } from "@/features/auth/types/role.type";
import { useClinicStaff } from "../hooks/useClinicStaff";
import { useActiveClinic } from "@/features/clinic/hooks/useActiveClinic";
import InviteStaffDialog from "../components/InviteStaffDialog";
import { useClinicInvitations } from "../hooks/useClinicInvitations";
import InvitationStatus from "../components/InvitationStatus";

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  doctor: "Doctor",
  receptionist: "Receptionist",
};

const roleStyles: Record<UserRole, string> = {
  admin: "bg-primary/10 text-primary",
  doctor: "bg-secondary text-secondary-foreground",
  receptionist: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { activeClinicId } = useActiveClinic();

  const {
    data: staff = [],
    isPending,
    isError,
    error,
    refetch,
  } = useClinicStaff();

  const {
    data: invitations = [],
    isPending: isInvitationsPending,
    isError: isInvitationsError,
    error: invitationsError,
    refetch: refetchInvitations,
  } = useClinicInvitations(activeClinicId);

  const filteredStaff = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) return staff;

    return staff.filter((member) => {
      const name = member.profile?.full_name ?? "";
      return (
        name.toLowerCase().includes(searchValue) ||
        member.role.toLowerCase().includes(searchValue)
      );
    });
  }, [staff, search]);

  const activeCount = staff.filter(
    (member) => member.status === "active",
  ).length;

  const doctorCount = staff.filter(
    (member) => member.role === "doctor" && member.status === "active",
  ).length;

  const receptionistCount = staff.filter(
    (member) => member.role === "receptionist" && member.status === "active",
  ).length;

  if (isPending) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-border/70 bg-card p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <Users size={22} className="text-destructive" />
        </div>

        <p className="text-sm text-muted-foreground">
          {error.message || "Unable to load clinic staff."}
        </p>

        <button
          onClick={() => refetch()}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-primary">
            TEAM MANAGEMENT
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Staff Directory
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your clinic team and their roles.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen((prev) => !prev)}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <UserRoundPlus size={17} />
          Invite staff
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total members",
            value: staff.length,
            icon: Users,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Active doctors",
            value: doctorCount,
            icon: Stethoscope,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Active receptionists",
            value: receptionistCount,
            icon: UserRound,
            color: "text-primary",
            bg: "bg-primary/10",
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}
                >
                  <Icon size={20} className={stat.color} />
                </div>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex flex-col gap-5 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-semibold text-foreground">
                Team members
              </h2>

              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {staff.length}
              </span>
            </div>

            <p className="mt-1.5 text-sm text-muted-foreground">
              {activeCount} active members in your clinic
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search staff..."
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-ring focus:ring-4 focus:ring-ring/10"
            />
          </div>
        </div>

        {filteredStaff.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/70">
              {search ? (
                <Search size={28} className="text-muted-foreground/60" />
              ) : (
                <Users size={28} className="text-muted-foreground/60" />
              )}
            </div>

            <p className="font-semibold text-foreground">
              {staff.length === 0 ? "No staff members yet" : "No results found"}
            </p>

            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {staff.length === 0
                ? "Your clinic team members will appear here."
                : "Try searching with another name or role."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full min-w-162.5">
              <TableHeader>
                <TableRow className="border-b border-border/60 bg-muted/40 hover:bg-muted/40">
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Member
                  </TableHead>
                  <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Role
                  </TableHead>
                  <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Joined
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow
                    key={member.id}
                    className="border-border/50 transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3.5">
                        {member.profile?.avatar_url ? (
                          <img
                            src={member.profile.avatar_url}
                            alt=""
                            className="h-11 w-11 rounded-full border-2 border-background object-cover shadow-sm"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-background bg-primary/10 text-sm font-semibold text-primary shadow-sm">
                            {member.profile?.full_name
                              ?.charAt(0)
                              .toUpperCase() ?? "U"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            {member.profile?.full_name || "Unnamed member"}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            ID: {member.user_id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold ${roleStyles[member.role]}`}
                      >
                        {roleLabels[member.role]}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                          member.status === "active"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : member.status === "invited"
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                              : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            member.status === "active"
                              ? "bg-emerald-500"
                              : member.status === "invited"
                                ? "bg-amber-500"
                                : "bg-destructive"
                          }`}
                        />
                        <span className="capitalize">{member.status}</span>
                      </span>
                    </TableCell>

                    <TableCell className="text-sm font-medium text-muted-foreground">
                      {new Date(member.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 p-5 sm:px-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-semibold text-foreground">
                Invitations
              </h2>

              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {invitations.length}
              </span>
            </div>

            <p className="mt-1.5 text-sm text-muted-foreground">
              Track invitations sent to your clinic team.
            </p>
          </div>
        </div>

        {isInvitationsPending ? (
          <div className="flex min-h-32 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        ) : isInvitationsError ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              {invitationsError.message || "Unable to load invitations."}
            </p>

            <button
              onClick={() => refetchInvitations()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        ) : invitations.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center px-5 py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <UserRoundPlus className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="text-sm font-semibold text-foreground">
              No invitations yet
            </p>

            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Invitations you send to new team members will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full min-w-150">
              <TableHeader>
                <TableRow className="border-b border-border/60 bg-muted/40 hover:bg-muted/40">
                  <TableHead className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Role
                  </TableHead>
                  <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Expires
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow
                    key={invitation.id}
                    className="border-border/50 transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">
                        {invitation.email}
                      </p>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm capitalize text-muted-foreground">
                        {invitation.role}
                      </span>
                    </TableCell>

                    <TableCell>
                      <InvitationStatus status={invitation.status} />
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(invitation.expires_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      {activeClinicId && (
        <InviteStaffDialog
          clinicId={activeClinicId}
          onOpenChange={setIsInviteOpen}
          open={isInviteOpen}
        />
      )}
    </div>
  );
}
