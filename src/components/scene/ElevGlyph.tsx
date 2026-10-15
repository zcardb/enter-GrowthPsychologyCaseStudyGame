import type { ElevItem } from "@/game/types";
import { cn } from "@/lib/utils";
import { isDarkMat, matFill } from "./materials";

interface ElevGlyphProps {
  item: ElevItem;
  /** SVG y of the floor line. */
  floorY: number;
  ceilingY: number;
  emphasized: boolean;
}

/** Front-view glyph for elevation scenes. item.y is height above floor (cm). */
export function ElevGlyph({ item, floorY, ceilingY, emphasized }: ElevGlyphProps) {
  const { kind, x, w, h } = item;
  const top = floorY - item.y - h;
  const bottom = floorY - item.y;
  const fill = matFill[item.tone ?? defaultTone[kind]];
  const ink = cn(
    "stroke-ink",
    item.state === "problem" && "stroke-plan-bad",
    item.state === "good" && "stroke-plan-good",
  );
  const sw = item.state === "problem" || item.state === "good" ? 3 : 1.6;

  const shape = () => {
    switch (kind) {
      case "sofa":
        return (
          <>
            <rect x={x} y={top} width={w} height={h * 0.55} rx={8} className={cn(fill, ink)} strokeWidth={sw} />
            <rect x={x} y={top + h * 0.45} width={w} height={h * 0.4} rx={6} className={cn(fill, ink)} strokeWidth={sw} />
            <rect x={x - 6} y={top + h * 0.3} width={16} height={h * 0.55} rx={6} className={cn(fill, ink)} strokeWidth={sw} />
            <rect x={x + w - 10} y={top + h * 0.3} width={16} height={h * 0.55} rx={6} className={cn(fill, ink)} strokeWidth={sw} />
            <line x1={x + 8} y1={bottom - h * 0.15} x2={x + 8} y2={bottom} className="stroke-ink" strokeWidth={3} />
            <line x1={x + w - 8} y1={bottom - h * 0.15} x2={x + w - 8} y2={bottom} className="stroke-ink" strokeWidth={3} />
          </>
        );
      case "bed":
        return (
          <>
            <rect x={x} y={top} width={w * 0.06} height={h} rx={4} className={cn(fill, ink)} strokeWidth={sw} />
            <rect x={x + w * 0.06} y={bottom - h * 0.45} width={w * 0.94} height={h * 0.3} rx={6} className={cn("fill-card", ink)} strokeWidth={sw} />
            <rect x={x + w * 0.08} y={bottom - h * 0.6} width={w * 0.18} height={h * 0.16} rx={6} className={cn("fill-mat-linen", ink)} strokeWidth={sw * 0.8} />
            <rect x={x + w * 0.06} y={bottom - h * 0.15} width={w * 0.94} height={h * 0.15} className={cn(fill, ink)} strokeWidth={sw} />
          </>
        );
      case "crib":
        return (
          <>
            <rect x={x} y={top} width={w} height={h} rx={4} className={cn("fill-none", ink)} strokeWidth={sw} />
            {Array.from({ length: 7 }, (_, i) => (i + 1) / 8).map((p) => (
              <line key={p} x1={x + w * p} y1={top} x2={x + w * p} y2={bottom} className="stroke-ink" strokeWidth={1} />
            ))}
          </>
        );
      case "cabinet":
      case "counter":
        return (
          <>
            <rect x={x} y={top} width={w} height={h} className={cn(fill, ink)} strokeWidth={sw} />
            {kind === "counter" && <rect x={x - 3} y={top - 4} width={w + 6} height={6} className={cn("fill-mat-stone", ink)} strokeWidth={1} />}
            {Array.from({ length: Math.max(1, Math.round(w / 60)) - 1 }, (_, i) => (i + 1) / Math.max(1, Math.round(w / 60))).map((p) => (
              <line key={p} x1={x + w * p} y1={top} x2={x + w * p} y2={bottom} className="stroke-ink/50" strokeWidth={1} />
            ))}
          </>
        );
      case "tv":
        return <rect x={x} y={top} width={w} height={h} rx={3} className="fill-ink stroke-ink" strokeWidth={sw} />;
      case "shelf":
        return (
          <>
            <rect x={x} y={top} width={w} height={h} className={cn("fill-none", ink)} strokeWidth={sw} />
            {[0.25, 0.5, 0.75].map((p) => (
              <line key={p} x1={x} y1={top + h * p} x2={x + w} y2={top + h * p} className="stroke-ink" strokeWidth={2} />
            ))}
          </>
        );
      case "window":
        return (
          <>
            <rect x={x} y={top} width={w} height={h} className={cn("fill-plan-window", ink)} strokeWidth={sw + 1} />
            <line x1={x + w / 2} y1={top} x2={x + w / 2} y2={bottom} className="stroke-ink" strokeWidth={2} />
          </>
        );
      case "door":
        return (
          <>
            <rect x={x} y={top} width={w} height={h} className={cn(fill, ink)} strokeWidth={sw} />
            <circle cx={x + w * 0.85} cy={top + h * 0.52} r={3} className="fill-ink" />
          </>
        );
      case "art":
        return (
          <>
            <rect x={x} y={top} width={w} height={h} className={cn("fill-card", ink)} strokeWidth={sw} />
            <rect x={x + w * 0.12} y={top + h * 0.12} width={w * 0.76} height={h * 0.76} className={fill} />
          </>
        );
      case "pendant":
        return (
          <>
            <line x1={x + w / 2} y1={ceilingY} x2={x + w / 2} y2={top} className="stroke-ink" strokeWidth={1.4} />
            <path d={`M${x + w * 0.3} ${top}H${x + w * 0.7}L${x + w} ${bottom}H${x}Z`} className={cn(fill, ink)} strokeWidth={sw} />
          </>
        );
      case "floorlamp":
        return (
          <>
            <line x1={x + w / 2} y1={top + h * 0.2} x2={x + w / 2} y2={bottom} className="stroke-ink" strokeWidth={2.5} />
            <path d={`M${x + w * 0.25} ${top}H${x + w * 0.75}L${x + w} ${top + h * 0.2}H${x}Z`} className={cn(fill, ink)} strokeWidth={sw} />
          </>
        );
      case "curtain":
        return (
          <>
            <rect x={x} y={top} width={w} height={h} className={cn(fill, ink, "opacity-90")} strokeWidth={sw} />
            {Array.from({ length: Math.max(2, Math.round(w / 16)) }, (_, i) => x + ((i + 1) * w) / (Math.round(w / 16) + 1)).map((lx) => (
              <line key={lx} x1={lx} y1={top} x2={lx} y2={bottom} className="stroke-ink/30" strokeWidth={1} />
            ))}
          </>
        );
      case "plant":
        return (
          <>
            <path d={`M${x + w * 0.2} ${bottom - h * 0.3}H${x + w * 0.8}L${x + w * 0.7} ${bottom}H${x + w * 0.3}Z`} className={cn("fill-mat-terracotta", ink)} strokeWidth={sw} />
            <ellipse cx={x + w * 0.5} cy={top + h * 0.35} rx={w * 0.45} ry={h * 0.35} className={cn("fill-mat-sage", ink)} strokeWidth={sw} />
          </>
        );
      case "mirror":
        return (
          <>
            <rect x={x} y={top} width={w} height={h} rx={4} className={cn("fill-mat-mirror", ink)} strokeWidth={sw} />
            <path d={`M${x + w * 0.2} ${top + h * 0.3}L${x + w * 0.45} ${top + h * 0.1}M${x + w * 0.25} ${top + h * 0.45}L${x + w * 0.6} ${top + h * 0.15}`} className="stroke-card" strokeWidth={2} />
          </>
        );
      case "desk":
      case "table":
        return (
          <>
            <rect x={x} y={top} width={w} height={8} className={cn(fill, ink)} strokeWidth={sw} />
            <line x1={x + 8} y1={top + 8} x2={x + 8} y2={bottom} className="stroke-ink" strokeWidth={3} />
            <line x1={x + w - 8} y1={top + 8} x2={x + w - 8} y2={bottom} className="stroke-ink" strokeWidth={3} />
          </>
        );
      case "person":
        return (
          <>
            <circle cx={x + w / 2} cy={top + w * 0.35} r={w * 0.3} className="fill-skin-2 stroke-ink" strokeWidth={1.6} />
            <rect x={x} y={top + w * 0.7} width={w} height={h - w * 0.7} rx={w * 0.35} className="fill-primary stroke-ink" strokeWidth={1.6} />
          </>
        );
      case "rail":
        return <rect x={x} y={top} width={w} height={Math.max(h, 5)} rx={3} className={cn("fill-mat-charcoal", ink)} strokeWidth={1} />;
      case "panel":
      default:
        return <rect x={x} y={top} width={w} height={h} className={cn(fill, ink)} strokeWidth={sw} />;
    }
  };

  const labelDark = isDarkMat(item.tone ?? defaultTone[kind]) && (kind === "panel" || kind === "cabinet");

  return (
    <g>
      {emphasized && (
        <rect x={x - 8} y={top - 8} width={w + 16} height={h + 16} rx={10} className="fill-plan-highlight/40 stroke-plan-highlight" strokeWidth={2.5} />
      )}
      {shape()}
      {item.label && (
        <text
          x={x + w / 2}
          y={kind === "pendant" ? bottom + 14 : top + h / 2}
          dominantBaseline="central"
          textAnchor="middle"
          fontSize={12}
          className={cn("select-none font-bold", labelDark ? "fill-card" : "fill-foreground")}
          paintOrder="stroke"
          stroke={labelDark ? "hsl(var(--ink))" : "hsl(var(--card))"}
          strokeWidth={3}
        >
          {item.label}
        </text>
      )}
    </g>
  );
}

const defaultTone: Record<ElevItem["kind"], NonNullable<ElevItem["tone"]>> = {
  sofa: "linen",
  bed: "oak",
  cabinet: "white",
  tv: "charcoal",
  shelf: "oak",
  window: "white",
  door: "white",
  art: "terracotta",
  pendant: "mustard",
  floorlamp: "linen",
  counter: "white",
  curtain: "linen",
  plant: "sage",
  mirror: "mirror",
  desk: "oak",
  person: "terracotta",
  panel: "oak",
  rail: "charcoal",
  crib: "white",
  table: "oak",
};
