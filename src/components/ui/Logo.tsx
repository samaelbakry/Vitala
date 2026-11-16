
import { Activity } from "lucide-react";

interface LogoProps {
  light?: boolean;
}

export default function Logo({ light = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border ${
          light
            ? "border-brand-300/20 bg-brand-300/15 shadow-inner"
            : "border-brand-300/30 bg-brand-100 shadow-sm dark:border-brand-300/20 dark:bg-brand-700/40"
        }`}
        aria-hidden="true"
      >
        <Activity
          className={`h-[21px] w-[21px] ${
            light
              ? "text-brand-300"
              : "text-brand-800 dark:text-brand-100"
          }`}
          strokeWidth={1.7}
        />
      </span>

      <span
        className={`text-[21px] font-medium tracking-[-0.055em] ${
          light ? "text-brand-100" : "text-brand-950 dark:text-brand-100"
        }`}
      >
        Vitala
        <span className="text-brand-300">.</span>
      </span>
    </div>
  );
}
