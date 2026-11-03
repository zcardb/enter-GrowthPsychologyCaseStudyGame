import { cn } from "@/lib/utils";

interface RoughFrameProps {
  className?: string;
  /** Extra offset for the second pencil pass, in viewBox units. */
  offset?: number;
  double?: boolean;
}

/**
 * Hand-drawn frame. Renders an absolutely positioned SVG whose wobbly path follows
 * the parent box; `preserveAspectRatio="none"` lets one path cover any card size while
 * non-scaling strokes stay crisp.
 */
export function RoughFrame({ className, offset = 3, double = true }: RoughFrameProps) {
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 text-ink", className)}
      style={{ width: "100%", height: "100%" }}
      fill="none"
    >
      <path
        d="M9 6Q200 2.5 391 7Q397 120 392 233Q200 237.5 8 232Q3.5 120 6.5 8.5Z"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {double && (
        <path
          d="M9 6Q200 2.5 391 7Q397 120 392 233Q200 237.5 8 232Q3.5 120 6.5 8.5Z"
          stroke="currentColor"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.28}
          vectorEffect="non-scaling-stroke"
          transform={`translate(${offset} ${offset}) rotate(${offset / 6} 200 120)`}
        />
      )}
    </svg>
  );
}
