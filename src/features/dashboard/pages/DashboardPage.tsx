import {
  ArrowUpRight,
  CalendarCheck,
  Clock,
  Plus,
  Stethoscope,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    label: "Total patients",
    value: "0",
    icon: Users,
    to: "/patients",
    description: "Registered patients",
  },
  {
    label: "Appointments today",
    value: "0",
    icon: CalendarCheck,
    to: "/appointments",
    description: "Scheduled for today",
  },
  {
    label: "Active doctors",
    value: "0",
    icon: Stethoscope,
    to: "/dashboard",
    description: "Available medical staff",
  },
  {
    label: "Pending appointments",
    value: "0",
    icon: Clock,
    to: "/appointments",
    description: "Awaiting confirmation",
  },
];

export default function DashboardPage() {
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <section className="space-y-9">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-700 dark:bg-brand-300" />
            {today}
          </div>

          <h1 className="text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-[38px]">
            Good day<span className="text-brand-700 dark:text-brand-300">.</span>
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Here's what's happening at your clinic today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/patients"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-[13px] font-medium text-foreground shadow-sm transition-all hover:border-brand-300/60 hover:bg-accent hover:text-accent-foreground"
          >
            <Plus size={16} strokeWidth={1.7} />
            Add patient
          </Link>

          <Link
            to="/appointments"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <CalendarCheck size={16} strokeWidth={1.7} />
            New appointment
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, to, description }, index) => (
          <Link
            key={label}
            to={to}
            className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-300/60 hover:shadow-md"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-300/10 blur-3xl transition-opacity group-hover:opacity-100" />

            <div className="relative flex items-center justify-between">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl border border-brand-300/20 ${
                  index % 2 === 0
                    ? "bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-100"
                    : "bg-brand-300/15 text-brand-700 dark:bg-brand-800/50 dark:text-brand-300"
                }`}
              >
                <Icon size={19} strokeWidth={1.6} />
              </span>

              <ArrowUpRight
                size={16}
                className="text-muted-foreground/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-700 dark:group-hover:text-brand-300"
              />
            </div>

            <div className="relative mt-7">
              <p className="text-[34px] font-medium tracking-[-0.04em] text-foreground tabular-nums">
                {value}
              </p>

              <h2 className="mt-1 text-[13px] font-medium text-foreground">
                {label}
              </h2>

              <p className="mt-1 text-[11px] text-muted-foreground">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <section className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <div className="group relative min-h-[290px] overflow-hidden rounded-3xl border border-brand-300/20 bg-gradient-to-br from-brand-100 via-background to-card p-7 text-foreground shadow-sm dark:border-brand-700/30 dark:from-brand-950 dark:via-brand-900 dark:to-brand-800 dark:text-brand-100 sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border border-brand-300/20 bg-brand-300/10 blur-3xl dark:border-brand-300/10 dark:bg-brand-300/10" />

          <div className="pointer-events-none absolute bottom-[-100px] right-1/4 h-64 w-64 rounded-full bg-brand-300/15 blur-[90px] dark:bg-brand-300/10" />

          <div className="relative flex h-full flex-col items-start justify-between gap-8">
            <div>
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-300/30 bg-brand-300/15 text-brand-800 dark:border-brand-300/20 dark:bg-brand-300/10 dark:text-brand-300">
                <CalendarCheck size={20} strokeWidth={1.6} />
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-800 dark:text-brand-300">
                Your clinic overview
              </p>

              <h2 className="mt-4 max-w-md text-2xl font-medium leading-[1.35] tracking-[-0.025em] sm:text-3xl">
                Better care starts with a more organized day.
              </h2>

              <p className="mt-3 max-w-md text-[13px] leading-6 text-muted-foreground dark:text-brand-100/70">
                Manage your schedule, keep patient information organized,
                and make every visit feel effortless.
              </p>
            </div>

            <Link
              to="/appointments"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-300/30 bg-brand-700 px-4 py-3 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-brand-800 dark:border-brand-300/20 dark:bg-brand-300/15 dark:text-brand-100 dark:hover:bg-brand-300/25"
            >
              Schedule an appointment
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:p-7">
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-300/10 blur-3xl" />

          <div className="relative flex h-full flex-col">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-300/30 bg-brand-100 text-brand-800 dark:border-brand-700/40 dark:bg-brand-900/50 dark:text-brand-100">
              <Stethoscope size={20} strokeWidth={1.6} />
            </div>

            <h2 className="mt-6 text-xl font-medium tracking-[-0.025em] text-foreground">
              Your clinic, connected.
            </h2>

            <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
              Everything you need to manage your clinic in one calm,
              organized workspace.
            </p>

            <div className="mt-auto space-y-2.5 pt-8">
              <Link
                to="/patients"
                className="flex items-center justify-between rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-[13px] text-foreground transition-all hover:border-brand-300/50 hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex items-center gap-3">
                  <Users
                    size={16}
                    className="text-brand-700 dark:text-brand-300"
                  />
                  Patients
                </span>
                <ArrowUpRight
                  size={15}
                  className="text-muted-foreground transition-transform group-hover:-translate-y-0.5"
                />
              </Link>

              <Link
                to="/appointments"
                className="flex items-center justify-between rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-[13px] text-foreground transition-all hover:border-brand-300/50 hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex items-center gap-3">
                  <CalendarCheck
                    size={16}
                    className="text-brand-700 dark:text-brand-300"
                  />
                  Appointments
                </span>
                <ArrowUpRight
                  size={15}
                  className="text-muted-foreground"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}