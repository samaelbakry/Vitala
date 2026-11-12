import { Activity } from "lucide-react";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          light ? "bg-[#3DDC97]" : "bg-[#0E2A2B]"
        }`}
        aria-hidden="true"
      >
        <Activity className="h-5 w-5" strokeWidth={2.2} color={light ? "#0E2A2B" : "#3DDC97"} />
      </span>
      <span className={`auth-display text-xl font-bold ${light ? "text-white" : "text-[#0E2A2B]"}`}>
        Vitala
      </span>
    </div>
  );
}
