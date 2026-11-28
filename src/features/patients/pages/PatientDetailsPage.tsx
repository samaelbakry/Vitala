import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";

import { displayValue, formatDate } from "@/lib/utils";
import { useActiveClinic } from "@/features/clinic/hooks/useActiveClinic";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import EditPatientDialog from "../components/EditPatientDialog";
import { usePatient } from "../hooks/usePatient";

export default function PatientDetailsPage() {
  const { patientId } = useParams();
  const { activeClinicId, isPending: isClinicPending } = useActiveClinic();

  const {
    data: patient,
    isPending: isPatientPending,
    isError,
    error,
  } = usePatient(activeClinicId, patientId ?? "");

  if (isClinicPending || isPatientPending) {
    return (
      <main className="mx-auto max-w-5xl space-y-6 pb-8">
        <div className="h-8 w-36 animate-pulse rounded-lg bg-muted" />
        <div className="h-48 animate-pulse rounded-2xl bg-muted/60" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted/60" />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-5xl rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <p className="font-semibold text-foreground">
          Couldn’t load patient details
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Please try again."}
        </p>
        <Button variant="outline" className="mt-5">
          <Link to="/patients">Back to patients</Link>
        </Button>
      </main>
    );
  }

  if (!patient) {
    return (
      <main className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-8 text-center">
        <p className="font-semibold text-foreground">Patient not found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          This patient may have been removed or may not belong to this clinic.
        </p>
        <Button variant="outline" className="mt-5">
          <Link to="/patients">Back to patients</Link>
        </Button>
      </main>
    );
  }

  const initials = patient.full_name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <main className="mx-auto max-w-5xl space-y-6 pb-8">
      <Button
        variant="ghost"
        className="-ml-3 w-fit gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link to="/patients" className="flex items-center gap-2" >
          <ArrowLeft size={16} />
          Back to patients
        </Link>
      </Button>

      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-brand-700 via-brand-500 to-brand-300" />

        <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-xl font-semibold text-brand-800 ring-4 ring-brand-100/40 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-500/10">
              {initials || <UserRound size={26} />}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-300">
                Patient profile
              </p>
              <h1 className="mt-1 wrap-break-word text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {patient.full_name}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Patient ID: {patient.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          <EditPatientDialog key={patient.id} patient={patient} />
        </div>

        <div className="grid gap-4 border-t border-border/60 bg-muted/20 px-5 py-4 sm:grid-cols-3 sm:px-7">
          <QuickInfo
            icon={<Phone size={16} />}
            label="Phone"
            value={displayValue(patient.phone)}
          />
          <QuickInfo
            icon={<Mail size={16} />}
            label="Email"
            value={displayValue(patient.email)}
          />
          <QuickInfo
            icon={<CalendarDays size={16} />}
            label="Date of birth"
            value={formatDate(patient.date_of_birth)}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="border-b border-border/60 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-800 dark:bg-brand-500/10 dark:text-brand-300">
                <UserRound size={19} />
              </div>
              <div>
                <CardTitle className="text-base">Personal information</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Basic information saved for this patient
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2 sm:p-6">
            <InfoItem label="Full name" value={patient.full_name} />
            <InfoItem
              label="Gender"
              value={
                patient.gender
                  ? patient.gender.charAt(0).toUpperCase() +
                    patient.gender.slice(1)
                  : "Not provided"
              }
            />
            <InfoItem label="Phone number" value={displayValue(patient.phone)} />
            <InfoItem label="Email address" value={displayValue(patient.email)} />
            <InfoItem
              label="Date of birth"
              value={formatDate(patient.date_of_birth)}
            />
            <InfoItem
              label="Added to clinic"
              value={formatDate(patient.created_at)}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="border-b border-border/60 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-800 dark:bg-brand-500/10 dark:text-brand-300">
                <FileText size={19} />
              </div>
              <div>
                <CardTitle className="text-base">Patient notes</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Additional information
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6">
            {patient.notes?.trim() ? (
              <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-foreground">
                {patient.notes}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No notes have been added for this patient.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function QuickInfo({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 shrink-0 text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 wrap-break-word text-sm font-medium text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1.5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="wrap-break-word text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
