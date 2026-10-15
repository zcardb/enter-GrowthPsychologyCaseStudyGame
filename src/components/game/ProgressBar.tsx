import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
}

/** Chunky comic progress bar. */
export function ProgressBar({ value, max, className, barClassName }: ProgressBarProps) {
  const pct = max === 0 ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div
      className={cn("h-3 overflow-hidden rounded-full border-2 border-ink bg-card", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className={cn("h-full bg-primary transition-[width] duration-500", barClassName)} style={{ width: `${pct}%` }} />
    </div>
  );
}
