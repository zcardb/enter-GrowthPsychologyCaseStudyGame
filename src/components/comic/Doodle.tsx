import { cn } from "@/lib/utils";

interface DoodleProps {
  className?: string;
}

/** Wavy hand-drawn divider line. Stroke follows `currentColor` when set. */
export function Squiggle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 16" className={cn("text-ink", className)} fill="none" aria-hidden="true">
      <path
        d="M2 10c10-7 20 5 30-1s20-8 30-1 20 9 30 2 18-6 26-1"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Four-point sparkle. */
export function Sparkle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-accent-foreground", className)} fill="none" aria-hidden="true">
      <path
        d="M12 2c1 5 2 7 8 8-6 1-7 3-8 8-1-5-2-7-8-8 6-1 7-3 8-8Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Outline star with a wobbly hand-drawn edge. */
export function StarDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 28 28" className={cn("text-chapter-3", className)} fill="none" aria-hidden="true">
      <path
        d="M14 3.5l3.1 6.4 6.9 1-5 4.9 1.2 7-6.2-3.3-6.1 3.3 1.1-7-5-4.9 6.9-1L14 3.5Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
        className="fill-accent/40"
      />
    </svg>
  );
}

/** Sun with rays, used as a page accent. */
export function SunDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" className={cn("text-primary-ink", className)} fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="7" stroke="currentColor" strokeWidth={2} className="fill-accent/60" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        const x1 = 20 + Math.cos(a) * 11;
        const y1 = 20 + Math.sin(a) * 11;
        const x2 = 20 + Math.cos(a) * 15.5;
        const y2 = 20 + Math.sin(a) * 15.5;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />;
      })}
    </svg>
  );
}

/** Curved marker arrow pointing down-right. */
export function ArrowDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 32" className={cn("text-primary-ink", className)} fill="none" aria-hidden="true">
      <path d="M3 6c8 15 20 20 36 17" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
      <path d="M31 18l9 5-8 5" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Loose spiral scribble. */
export function Swirl({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 28" className={cn("text-secondary-foreground", className)} fill="none" aria-hidden="true">
      <path
        d="M2 20c4-12 18-16 22-6 3 8-10 12-11 3-1-8 13-13 24-8"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Hand-drawn circled scribble, sized to its parent box. */
export function ScribbleCircle({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("pointer-events-none absolute inset-0 h-full w-full text-ink", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M52 7c23 1 40 17 39 40-1 22-18 45-42 45C27 92 10 75 10 51 10 29 28 6 54 8"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Curved marker arrow, used to point at the primary action. */
export function ArrowCurve({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 46 40" className={cn("text-primary-ink", className)} fill="none" aria-hidden="true">
      <path d="M5 34c2-14 12-25 32-27" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
      <path d="M28 3l9 4-6 8" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Three loose confetti strokes for celebration strips. */
export function Confetti({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 24" className={cn("text-primary-ink", className)} fill="none" aria-hidden="true">
      <path d="M4 18l5-9" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
      <path d="M16 8l4 6" className="text-chapter-2" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
      <path d="M28 20l6-11" className="text-chapter-3" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
      <circle cx="35" cy="5" r="1.8" className="fill-primary" />
    </svg>
  );
}

/** Short hand-drawn dashed connector between steps. */
export function AlongDashed({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 6" className={cn("text-ink/35", className)} fill="none" aria-hidden="true">
      <path d="M1 3.4Q10 1.6 20 3.2T39 2.8" stroke="currentColor" strokeWidth={2} strokeDasharray="5 5" strokeLinecap="round" />
    </svg>
  );
}
