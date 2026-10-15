import type { ElementTone, Mark } from "@/game/types";
import { cn } from "@/lib/utils";

const toneClass: Record<ElementTone, { box: string; text: string }> = {
  default: { box: "fill-card stroke-ink", text: "fill-foreground" },
  highlight: { box: "fill-accent stroke-ink", text: "fill-accent-foreground" },
  problem: { box: "fill-destructive stroke-ink", text: "fill-destructive-foreground" },
  good: { box: "fill-success stroke-ink", text: "fill-success-foreground" },
  muted: { box: "fill-muted stroke-plan-line", text: "fill-muted-foreground" },
};

interface SceneMarkProps {
  mark: Mark;
  k: number;
  emphasized?: boolean;
}

/** Callout pill used on plans and elevations. Anchored at its center. */
export function SceneMark({ mark, k, emphasized }: SceneMarkProps) {
  const fs = 12 * k;
  // CJK glyphs are ~1em wide; latin/digits ~0.6em.
  const textW = [...mark.label].reduce((acc, ch) => acc + (ch.charCodeAt(0) < 256 ? 0.6 : 1), 0) * fs;
  const w = textW + 14 * k;
  const h = fs + 10 * k;
  const tone = toneClass[mark.tone ?? "default"];
  return (
    <g className={cn(emphasized && "animate-pulse")}>
      <rect
        x={mark.x - w / 2}
        y={mark.y - h / 2}
        width={w}
        height={h}
        rx={h / 2}
        className={tone.box}
        strokeWidth={1.4 * k}
      />
      <text
        x={mark.x}
        y={mark.y}
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={fs}
        className={cn("select-none font-bold", tone.text)}
      >
        {mark.label}
      </text>
    </g>
  );
}
