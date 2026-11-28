import { useState } from "react";
import { AlertCircle, Search, UserRound, Users } from "lucide-react";

import { usePatients } from "../hooks/usePatients";
import { useActiveClinic } from "@/features/clinic/hooks/useActiveClinic";
import AddPatientDialog from "../components/AddPatientDialog";
import { Link } from "react-router-dom";

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const { activeClinicId, isPending: isClinicPending } = useActiveClinic();

  const {
    data: patients = [],
    isPending: isPatientsPending,
    isError,
    error,
    refetch,
  } = usePatients(activeClinicId, search);

  const isLoading = isClinicPending || isPatientsPending;

  const filteredPatients = patients.filter((patient) =>
    patient.full_name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  return (
    <main className="mx-auto max-w-7xl space-y-8 pb-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-brand-700 dark:text-brand-300">
            PATIENT MANAGEMENT
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Patients Directory
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your clinic’s patient records.
          </p>
        </div>

        <div className="flex items-center gap-1">
          {activeClinicId && <AddPatientDialog clinicId={activeClinicId} />}

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search patients..."
              aria-label="Search patients by name"
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/10"
            />
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {[
          {
            label: "Total patients",
            value: patients.length,
            icon: Users,
          },
          {
            label: "Matching patients",
            value: filteredPatients.length,
            icon: UserRound,
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

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-500/10">
                  <Icon
                    size={20}
                    className="text-brand-700 dark:text-brand-300"
                  />
                </div>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
            </div>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex flex-col gap-5 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-semibold text-foreground">
                All patients
              </h2>

              <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-800 dark:bg-brand-500/10 dark:text-brand-300">
                {filteredPatients.length}
              </span>
            </div>

            <p className="mt-1.5 text-sm text-muted-foreground">
              {isLoading
                ? "Loading patients..."
                : `${filteredPatients.length} patients in your clinic`}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-500/10">
            <Users size={20} className="text-brand-700 dark:text-brand-300" />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5">
            <div className="h-14 animate-pulse rounded-xl bg-muted/60" />
            <div className="h-14 animate-pulse rounded-xl bg-muted/60" />
            <div className="h-14 animate-pulse rounded-xl bg-muted/60" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>

            <div>
              <p className="font-semibold text-foreground">
                Couldn’t load patients
              </p>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong. Please try again."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 dark:bg-brand-300 dark:text-brand-950 dark:hover:bg-brand-200"
            >
              Try again
            </button>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/70">
              {search.trim() ? (
                <Search size={28} className="text-muted-foreground/60" />
              ) : (
                <Users size={28} className="text-muted-foreground/60" />
              )}
            </div>

            <p className="font-semibold text-foreground">
              {search.trim() ? "No matching patients" : "No patients yet"}
            </p>

            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {search.trim()
                ? "Try searching with a different name."
                : "Patients added to this clinic will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40">
                  <th className="h-12 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Patient
                  </th>

                  <th className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone
                  </th>

                  <th className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </th>

                  <th className="h-12 pr-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Added
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-border/50 transition-colors last:border-b-0 hover:bg-muted/40"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-background bg-brand-100 text-sm font-semibold text-brand-800 shadow-sm dark:bg-brand-700/40 dark:text-brand-100">
                          {patient.full_name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                          <Link
                            to={`/patients/${patient.id}`}
                            className="text-sm font-semibold text-foreground transition-colors hover:text-brand-700 dark:hover:text-brand-300"
                          >
                            {patient.full_name || "Unnamed patient"}
                          </Link>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Patient ID: {patient.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-5 text-sm text-muted-foreground">
                      {patient.phone || "—"}
                    </td>

                    <td className="py-5 text-sm text-muted-foreground">
                      {patient.email || "—"}
                    </td>

                    <td className="py-5 pr-6 text-sm font-medium text-muted-foreground">
                      {new Date(patient.created_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
