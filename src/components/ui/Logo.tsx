import { Activity } from "lucide-react";

type LogoProps = {
  light?: boolean;
  iconOnly?: boolean;
};

export default function Logo({ light = false, iconOnly = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border shadow-sm transition-colors duration-300 ${
          light
            ? "border-sidebar-border bg-sidebar-accent"
            : "border-brand-300/40 bg-brand-100 dark:border-brand-700/50 dark:bg-brand-900/50"
        }`}
        aria-hidden="true"
      >
        <Activity
          className={`h-5.25 w-5.25 ${
            light
              ? "text-sidebar-primary"
              : "text-brand-900 dark:text-brand-100"
          }`}
          strokeWidth={1.7}
        />
      </span>

      {!iconOnly && (
        <span
          className={`text-5.25 font-semibold tracking-[-0.055em] ${
            light
              ? "text-sidebar-foreground"
              : "text-brand-950 dark:text-brand-100"
          }`}
        >
          Vitala
          <span className="text-brand-700 dark:text-brand-300">.</span>
        </span>
      )}
    </div>
  );
}