import { useId } from "react";
import type { ElementTone, Mark, Opening, PlanScene } from "@/game/types";
import { cn } from "@/lib/utils";
import { Furniture } from "./Furniture";
import { SceneMark } from "./SceneMark";

interface FloorPlanViewProps {
  scene: PlanScene;
  emphasis?: ReadonlySet<string>;
  className?: string;
}

const WALL = 12;

const zoneTone: Record<ElementTone, string> = {
  default: "fill-plan-zone/10 stroke-plan-zone",
  highlight: "fill-plan-highlight/30 stroke-plan-highlight",
  problem: "fill-plan-bad/10 stroke-plan-bad",
  good: "fill-plan-good/10 stroke-plan-good",
  muted: "fill-ink/5 stroke-plan-line",
};

/** Top-down SVG floor plan rendered from structured scene data. */
export function FloorPlanView({ scene, emphasis, className }: FloorPlanViewProps) {
  const uid = useId().replace(/:/g, "");
  const { width: W, height: H } = scene;
  const k = Math.max(W, H) / 500;
  const pad = 40 * k;
  const isEm = (id: string) => emphasis?.has(id) ?? false;

  const rugs = scene.items.filter((i) => i.kind === "rug");
  const solids = scene.items.filter((i) => i.kind !== "rug");

  const openingRect = (o: Opening, extra: number) =>
    o.orient === "h"
      ? { x: o.x, y: o.y - extra / 2, width: o.w, height: extra }
      : { x: o.x - extra / 2, y: o.y, width: extra, height: o.w };

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${W + pad * 2} ${H + pad * 2}`}
      preserveAspectRatio="xMidYMid meet"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="户型平面示意"
    >
      <defs>
        {(["good", "bad"] as const).map((t) => (
          <marker key={t} id={`${uid}-arrow-${t}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" className={t === "good" ? "fill-plan-good" : "fill-plan-bad"} />
          </marker>
        ))}
        <pattern id={`${uid}-hatch`} width={8 * k} height={8 * k} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={8 * k} height={8 * k} className="fill-plan-wall" />
          <line x1="0" y1="0" x2="0" y2={8 * k} className="stroke-accent" strokeWidth={3 * k} />
        </pattern>
      </defs>

      <rect x={0} y={0} width={W} height={H} className="fill-plan-floor" />

      {scene.zones.map((z) => (
        <g key={z.id}>
          <rect
            x={z.x}
            y={z.y}
            width={z.w}
            height={z.h}
            rx={6 * k}
            className={cn(zoneTone[z.tone ?? "default"], isEm(z.id) && "fill-plan-highlight/40")}
            strokeWidth={1.5 * k}
            strokeDasharray={`${6 * k} ${4 * k}`}
          />
          <text x={z.x + 8 * k} y={z.y + 16 * k} fontSize={12 * k} className="fill-muted-foreground font-medium">
            {z.label}
          </text>
        </g>
      ))}

      {rugs.map((item) => (
        <Furniture key={item.id} item={item} k={k} emphasized={isEm(item.id)} />
      ))}

      {/* Outer walls */}
      <rect x={0} y={0} width={W} height={H} className="fill-none stroke-plan-wall" strokeWidth={WALL * k} />

      {/* Interior walls */}
      {scene.walls.map((w) => {
        const horizontal = w.y1 === w.y2;
        const t = (w.bearing ? 16 : 10) * k;
        const rect = horizontal
          ? { x: Math.min(w.x1, w.x2), y: w.y1 - t / 2, width: Math.abs(w.x2 - w.x1), height: t }
          : { x: w.x1 - t / 2, y: Math.min(w.y1, w.y2), width: t, height: Math.abs(w.y2 - w.y1) };
        return (
          <g key={w.id}>
            {isEm(w.id) && (
              <rect {...rect} x={rect.x - 5 * k} y={rect.y - 5 * k} width={rect.width + 10 * k} height={rect.height + 10 * k} className="fill-plan-highlight/60" />
            )}
            <rect
              {...rect}
              fill={w.bearing ? `url(#${uid}-hatch)` : undefined}
              className={cn(
                !w.bearing && "fill-plan-wall",
                w.tone === "problem" && "stroke-plan-bad",
                w.tone === "muted" && "opacity-30",
              )}
              strokeWidth={w.tone === "problem" ? 3 * k : 0}
            />
          </g>
        );
      })}

      {/* Windows */}
      {scene.windows.map((o) => {
        const r = openingRect(o, WALL * k + 2 * k);
        return (
          <g key={o.id}>
            <rect {...r} className={cn("fill-plan-window stroke-plan-wall", isEm(o.id) && "fill-plan-highlight")} strokeWidth={1.2 * k} />
            {o.orient === "h" ? (
              <line x1={o.x} y1={o.y} x2={o.x + o.w} y2={o.y} className="stroke-plan-wall" strokeWidth={1 * k} />
            ) : (
              <line x1={o.x} y1={o.y} x2={o.x} y2={o.y + o.w} className="stroke-plan-wall" strokeWidth={1 * k} />
            )}
          </g>
        );
      })}

      {/* Doors: gap + leaf + swing arc (swings into the room) */}
      {scene.doors.map((o) => {
        const gap = openingRect(o, WALL * k + 18 * k);
        const inward = o.orient === "h" ? (o.y < H / 2 ? 1 : -1) : o.x < W / 2 ? 1 : -1;
        const leaf =
          o.orient === "h"
            ? `M${o.x} ${o.y}L${o.x} ${o.y + inward * o.w}`
            : `M${o.x} ${o.y}L${o.x + inward * o.w} ${o.y}`;
        const arc =
          o.orient === "h"
            ? `M${o.x} ${o.y + inward * o.w}A${o.w} ${o.w} 0 0 ${inward > 0 ? 0 : 1} ${o.x + o.w} ${o.y}`
            : `M${o.x + inward * o.w} ${o.y}A${o.w} ${o.w} 0 0 ${inward > 0 ? 1 : 0} ${o.x} ${o.y + o.w}`;
        return (
          <g key={o.id}>
            <rect {...gap} className="fill-plan-floor" />
            {isEm(o.id) && <rect {...gap} className="fill-plan-highlight/60" />}
            <path d={leaf} className="fill-none stroke-plan-wall" strokeWidth={2.4 * k} />
            <path d={arc} className="fill-none stroke-plan-line" strokeWidth={1 * k} strokeDasharray={`${4 * k} ${3 * k}`} />
          </g>
        );
      })}

      {solids.map((item) => (
        <Furniture key={item.id} item={item} k={k} emphasized={isEm(item.id)} />
      ))}

      {scene.flows.map((f) => (
        <g key={f.id}>
          <polyline
            points={f.points.map((p) => p.join(",")).join(" ")}
            className={cn(
              "fill-none animate-dash-flow motion-reduce:animate-none",
              f.tone === "good" ? "stroke-plan-good" : "stroke-plan-bad",
            )}
            strokeWidth={(isEm(f.id) ? 4.5 : 3.2) * k}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${10 * k} ${8 * k}`}
            markerEnd={`url(#${uid}-arrow-${f.tone})`}
          />
          {f.label && <SceneMark mark={flowLabel(f.id, f.points, f.label, f.tone)} k={k} />}
        </g>
      ))}

      {scene.marks.map((m) => (
        <SceneMark key={m.id} mark={m} k={k} emphasized={isEm(m.id)} />
      ))}
    </svg>
  );
}

const flowLabel = (id: string, points: [number, number][], label: string, tone: "good" | "bad"): Mark => {
  const mid = points[Math.floor(points.length / 2)];
  return { id: `${id}-label`, x: mid[0], y: mid[1], label, tone: tone === "good" ? "good" : "problem" };
};
