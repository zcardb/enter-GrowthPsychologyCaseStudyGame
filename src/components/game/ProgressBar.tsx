import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
}

/** Doodle progress bar: hand-drawn track, crayon-striped fill, pen-nib tip. */
export function ProgressBar({ value, max, className, barClassName }: ProgressBarProps) {
  const pct = max === 0 ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div
      className={cn(
        "doodle-pill relative h-3.5 overflow-hidden border-2 border-ink bg-card p-[2px]",
        className,
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className="absolute inset-x-2 inset-y-0 flex items-center" aria-hidden>
        <span className="h-px w-full border-t border-dashed border-ink/20" />
      </div>
      <div
        className={cn(
          "crayon-stripes doodle-pill relative h-full bg-primary transition-[width] duration-500",
          barClassName,
        )}
        style={{ width: `${pct}%` }}
      >
        {pct > 0 && (
          <span
            aria-hidden
            className="absolute -right-[2px] top-1/2 h-3 w-[3px] -translate-y-1/2 rotate-6 rounded-full bg-ink/70"
          />
        )}
      </div>
    </div>
  );
}
