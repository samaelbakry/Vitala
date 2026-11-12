import { CalendarCheck, Clock, Stethoscope, Users } from "lucide-react";

const stats = [
  { label: "Total patients", value: "0", icon: Users },
  { label: "Appointments today", value: "0", icon: CalendarCheck },
  { label: "Active doctors", value: "0", icon: Stethoscope },
  { label: "Pending appointments", value: "0", icon: Clock },
];

export default function DashboardPage() {
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <section className="text-[#0E2A2B]">
      <header className="mb-10">
        <p className="text-sm text-[#5B7270]">{today}</p>
        <h1 className="mt-1 font-['Bricolage_Grotesque',sans-serif] text-4xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-[#5B7270]">Welcome to Vitala.</p>
      </header>

      <dl className="grid overflow-hidden rounded-2xl border border-[#D3DEDB] bg-white sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }, i) => (
          <div
            key={label}
            className={`flex flex-col gap-6 p-6 ${
              i > 0 ? "border-t border-[#D3DEDB]" : ""
            } ${i % 2 === 1 ? "sm:border-l" : "sm:border-l-0"} ${
              i === 1 ? "sm:border-t-0" : ""
            } lg:border-l lg:border-t-0 ${i === 0 ? "lg:border-l-0" : ""}`}
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4F7EE] text-[#0F6B5C]"
              aria-hidden="true"
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
            </span>

            <div>
              <dd className="font-['Bricolage_Grotesque',sans-serif] text-5xl font-bold leading-none tabular-nums">
                {value}
              </dd>
              <dt className="mt-2 text-sm text-[#5B7270]">{label}</dt>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex items-start gap-4 rounded-2xl bg-[#0E2A2B] p-6 text-white">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3DDC97] text-[#0E2A2B]">
          <CalendarCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl font-bold">
            Nothing scheduled today
          </h2>
          <p className="mt-1 max-w-xl leading-7 text-[#A9C3BF]">
            Add your first patient and doctor, then book an appointment.
            Today&apos;s schedule will show up here.
          </p>
        </div>
      </div>
    </section>
  );
}