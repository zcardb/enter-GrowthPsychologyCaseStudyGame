import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
}

/** Doodle progress bar: hand-drawn track, crayon-striped fill. */
export function ProgressBar({ value, max, className, barClassName }: ProgressBarProps) {
  const pct = max === 0 ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div
      className={cn("doodle-pill h-3.5 overflow-hidden border-2 border-ink bg-card p-[2px]", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={cn("crayon-stripes doodle-pill h-full bg-primary transition-[width] duration-500", barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
