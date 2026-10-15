import { useId } from "react";
import type { ElevationScene, Light } from "@/game/types";
import { cn } from "@/lib/utils";
import { ElevGlyph } from "./ElevGlyph";
import { matFill } from "./materials";
import { SceneMark } from "./SceneMark";

interface ElevationViewProps {
  scene: ElevationScene;
  emphasis?: ReadonlySet<string>;
  className?: string;
}

const FLOOR = 34;
const PAD = 24;

const warmthVar: Record<Light["warmth"], string> = {
  warm: "hsl(var(--light-warm))",
  neutral: "hsl(var(--light-neutral))",
  cool: "hsl(var(--light-cool))",
};

const layerOpacity: Record<Light["layer"], number> = { ambient: 0.55, task: 0.8, accent: 0.7 };

/** Front elevation: wall surface, furniture, light layers and daylight. */
export function ElevationView({ scene, emphasis, className }: ElevationViewProps) {
  const uid = useId().replace(/:/g, "");
  const { width: W, height: H } = scene;
  const floorY = H;
  const isEm = (id: string) => emphasis?.has(id) ?? false;
  const windows = scene.items.filter((i) => i.kind === "window");
  const shade = (1 - scene.ambient) * 0.72;

  return (
    <svg
      viewBox={`${-PAD} ${-PAD} ${W + PAD * 2} ${H + FLOOR + PAD * 2}`}
      preserveAspectRatio="xMidYMid meet"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="立面示意"
    >
      <defs>
        {(Object.keys(warmthVar) as Light["warmth"][]).map((w) => (
          <radialGradient key={w} id={`${uid}-${w}`}>
            <stop offset="0%" style={{ stopColor: warmthVar[w], stopOpacity: 1 }} />
            <stop offset="55%" style={{ stopColor: warmthVar[w], stopOpacity: 0.45 }} />
            <stop offset="100%" style={{ stopColor: warmthVar[w], stopOpacity: 0 }} />
          </radialGradient>
        ))}
        <clipPath id={`${uid}-room`}>
          <rect x={0} y={0} width={W} height={H + FLOOR} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${uid}-room)`}>
        <rect x={0} y={0} width={W} height={H} className={cn(matFill[scene.wall], isEm("__surface") && "opacity-90")} />
        <rect x={0} y={H} width={W} height={FLOOR} className={matFill[scene.floor]} />
        <line x1={0} y1={H} x2={W} y2={H} className="stroke-ink" strokeWidth={2} />

        {scene.daylight !== "none" &&
          windows.map((win) => {
            const top = floorY - win.y - win.h;
            const harsh = scene.daylight === "harsh";
            return (
              <polygon
                key={`beam-${win.id}`}
                points={`${win.x},${top} ${win.x + win.w},${top} ${win.x + win.w + win.w * (harsh ? 0.9 : 0.6)},${H + FLOOR} ${win.x + win.w * (harsh ? 0.35 : 0.1)},${H + FLOOR}`}
                className={harsh ? "fill-light-warm" : "fill-light-neutral"}
                opacity={harsh ? 0.6 : 0.4}
              />
            );
          })}

        {scene.items.map((item) => (
          <ElevGlyph key={item.id} item={item} floorY={floorY} ceilingY={0} emphasized={isEm(item.id)} />
        ))}

        <rect x={0} y={0} width={W} height={H + FLOOR} className="pointer-events-none fill-shade" opacity={shade} />

        {scene.lights.map((l) => {
          const cy = floorY - l.y;
          return (
            <g key={l.id}>
              <circle cx={l.x} cy={cy} r={l.r} fill={`url(#${uid}-${l.warmth})`} opacity={layerOpacity[l.layer]} />
              <circle cx={l.x} cy={cy} r={4} style={{ fill: warmthVar[l.warmth] }} className="stroke-ink" strokeWidth={1} />
              {isEm(l.id) && <circle cx={l.x} cy={cy} r={12} className="fill-none stroke-plan-highlight" strokeWidth={3} />}
            </g>
          );
        })}
      </g>

      <rect x={0} y={0} width={W} height={H + FLOOR} className="fill-none stroke-ink" strokeWidth={3} />

      {scene.lights
        .filter((l) => l.label)
        .map((l) => (
          <SceneMark key={`lbl-${l.id}`} mark={{ id: `lbl-${l.id}`, x: l.x, y: floorY - l.y - 18, label: l.label!, tone: "highlight" }} k={0.85} />
        ))}
      {scene.marks.map((m) => (
        <SceneMark key={m.id} mark={{ ...m, y: floorY - m.y }} k={0.9} emphasized={isEm(m.id)} />
      ))}
    </svg>
  );
}
