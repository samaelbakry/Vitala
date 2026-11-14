import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  Stethoscope,
  Users,
  Plus,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  { label: "Total patients", value: "0", icon: Users, to: "/patients" },
  {
    label: "Appointments today",
    value: "0",
    icon: CalendarCheck,
    to: "/appointments",
  },
  { label: "Active doctors", value: "0", icon: Stethoscope, to: "/dashboard" },
  {
    label: "Pending appointments",
    value: "0",
    icon: Clock,
    to: "/appointments",
  },
];

export default function DashboardPage() {
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <section className="text-[#0E2A2B] space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E4F7EE] px-3 py-1 text-xs font-medium text-[#0F6B5C]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3DDC97]" />
            {today}
          </div>
          <h1 className="auth-display mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-[#0E2A2B]">
            Dashboard
          </h1>
          <p className="mt-1.5 text-base text-[#5B7270]">
            Welcome back to Vitala. Here is your clinic overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/patients"
            className="inline-flex items-center gap-2 rounded-xl border border-[#D3DEDB] bg-white px-4 py-2.5 text-sm font-medium text-[#0E2A2B] shadow-xs hover:bg-[#F5F8F7] transition-colors"
          >
            <Plus className="h-4 w-4 text-[#0F6B5C]" />
            Add Patient
          </Link>
          <Link
            to="/appointments"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0E2A2B] px-4 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-[#163D3E] transition-colors"
          >
            <CalendarCheck className="h-4 w-4 text-[#3DDC97]" />
            New Appointment
          </Link>
        </div>
      </header>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="group relative flex flex-col justify-between rounded-2xl border border-[#D3DEDB] bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3DDC97] hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E4F7EE] text-[#0F6B5C] transition-colors group-hover:bg-[#3DDC97] group-hover:text-[#0E2A2B]"
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>

              <ArrowUpRight className="h-4 w-4 text-[#8FA6A3] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0E2A2B] group-hover:opacity-100" />
            </div>

            <div className="mt-6">
              <dd className="auth-display text-4xl sm:text-5xl font-bold leading-none tabular-nums text-[#0E2A2B]">
                {value}
              </dd>
              <dt className="mt-2.5 text-sm font-medium text-[#5B7270]">
                {label}
              </dt>
            </div>
          </Link>
        ))}
      </dl>

      <div className="relative overflow-hidden rounded-2xl bg-[#0E2A2B] p-6 sm:p-8 text-white shadow-sm">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#3DDC97]/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#3DDC97] text-[#0E2A2B] shadow-sm">
              <CalendarCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="auth-display text-2xl font-bold tracking-tight">
                Nothing scheduled today
              </h2>
              <p className="mt-1.5 max-w-xl text-sm sm:text-base leading-relaxed text-[#A9C3BF]">
                Add your first patient and doctor, then book an appointment.
                Today&apos;s schedule will show up right here.
              </p>
            </div>
          </div>

          <Link
            to="/appointments"
            className="shrink-0 self-start sm:self-center inline-flex items-center gap-2 rounded-xl bg-[#3DDC97] px-5 py-2.5 text-sm font-semibold text-[#0E2A2B] hover:bg-[#32c987] transition-colors"
          >
            Schedule now
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}