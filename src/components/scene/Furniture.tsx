import type { ElementTone, PlanItem } from "@/game/types";
import { cn } from "@/lib/utils";

const strokeByTone: Record<ElementTone, string> = {
  default: "stroke-plan-line",
  highlight: "stroke-plan-highlight",
  problem: "stroke-plan-bad",
  good: "stroke-plan-good",
  muted: "stroke-plan-line",
};

interface FurnitureProps {
  item: PlanItem;
  k: number;
  emphasized: boolean;
}

const backAngle = { top: 0, right: 90, bottom: 180, left: -90 } as const;

/** Top-down furniture glyph for floor plans. */
export function Furniture({ item, k, emphasized }: FurnitureProps) {
  const back = item.back ?? "top";
  const sideways = back === "left" || back === "right";
  const cx = item.x + item.w / 2;
  const cy = item.y + item.h / 2;
  // Draw in a local frame with the back at the top, then rotate into place.
  const w = sideways ? item.h : item.w;
  const h = sideways ? item.w : item.h;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const { kind, label } = item;
  const tone = item.tone ?? "default";
  const sw = 1.6 * k;
  const stroke = strokeByTone[tone];
  const base = cn(stroke, "fill-plan-furniture");
  const line = cn(stroke, "fill-none");
  const r = Math.min(w, h) * 0.12;

  const detail = () => {
    switch (kind) {
      case "sofa":
      case "armchair":
        return (
          <>
            <rect x={x} y={y} width={w} height={h} rx={r} className={base} strokeWidth={sw} />
            <rect x={x} y={y} width={w} height={h * 0.28} rx={r * 0.6} className={line} strokeWidth={sw} />
            {kind === "sofa" && (
              <line x1={x + w / 2} y1={y + h * 0.28} x2={x + w / 2} y2={y + h} className={line} strokeWidth={sw * 0.7} />
            )}
          </>
        );
      case "bed":
      case "bunk":
        return (
          <>
            <rect x={x} y={y} width={w} height={h} rx={r * 0.5} className={base} strokeWidth={sw} />
            {w > 120 ? (
              <>
                <rect x={x + w * 0.08} y={y + h * 0.05} width={w * 0.38} height={h * 0.14} rx={4 * k} className="fill-card stroke-plan-line" strokeWidth={sw * 0.7} />
                <rect x={x + w * 0.54} y={y + h * 0.05} width={w * 0.38} height={h * 0.14} rx={4 * k} className="fill-card stroke-plan-line" strokeWidth={sw * 0.7} />
              </>
            ) : (
              <rect x={x + w * 0.15} y={y + h * 0.05} width={w * 0.7} height={h * 0.14} rx={4 * k} className="fill-card stroke-plan-line" strokeWidth={sw * 0.7} />
            )}
            <line x1={x} y1={y + h * 0.32} x2={x + w} y2={y + h * 0.32} className={line} strokeWidth={sw * 0.7} />
            {kind === "bunk" && (
              <line x1={x} y1={y + h} x2={x + w} y2={y + h * 0.32} className={line} strokeWidth={sw * 0.6} strokeDasharray={`${4 * k} ${4 * k}`} />
            )}
          </>
        );
      case "crib":
        return (
          <>
            <rect x={x} y={y} width={w} height={h} rx={r} className={base} strokeWidth={sw} />
            {[0.2, 0.4, 0.6, 0.8].map((p) => (
              <line key={p} x1={x + w * p} y1={y} x2={x + w * p} y2={y + h} className={line} strokeWidth={sw * 0.5} />
            ))}
          </>
        );
      case "chair":
        return (
          <>
            <rect x={x} y={y} width={w} height={h} rx={r * 2} className={base} strokeWidth={sw} />
            <line x1={x + w * 0.15} y1={y + h * 0.2} x2={x + w * 0.85} y2={y + h * 0.2} className={line} strokeWidth={sw} />
          </>
        );
      case "wardrobe":
      case "box":
        return (
          <>
            <rect x={x} y={y} width={w} height={h} className={base} strokeWidth={sw} />
            <line x1={x} y1={y} x2={x + w} y2={y + h} className={line} strokeWidth={sw * 0.6} />
            {kind === "box" && <line x1={x + w} y1={y} x2={x} y2={y + h} className={line} strokeWidth={sw * 0.6} />}
          </>
        );
      case "shelf":
      case "shoe":
      case "cabinet": {
        const vertical = h > w;
        const n = kind === "shelf" ? 3 : 1;
        return (
          <>
            <rect x={x} y={y} width={w} height={h} className={base} strokeWidth={sw} />
            {Array.from({ length: n }, (_, i) => (i + 1) / (n + 1)).map((p) =>
              vertical ? (
                <line key={p} x1={x} y1={y + h * p} x2={x + w} y2={y + h * p} className={line} strokeWidth={sw * 0.6} />
              ) : (
                <line key={p} x1={x + w * p} y1={y} x2={x + w * p} y2={y + h} className={line} strokeWidth={sw * 0.6} />
              ),
            )}
          </>
        );
      }
      case "tv":
      case "partition":
        return <rect x={x} y={y} width={w} height={h} rx={2 * k} className={cn(stroke, kind === "tv" ? "fill-ink" : "fill-ink/50")} strokeWidth={sw * 0.6} />;
      case "mirror":
        return <rect x={x} y={y} width={w} height={h} className={cn(stroke, "fill-mat-mirror")} strokeWidth={sw} />;
      case "fridge":
      case "washer":
        return (
          <>
            <rect x={x} y={y} width={w} height={h} rx={3 * k} className={cn(stroke, "fill-card")} strokeWidth={sw} />
            {kind === "washer" ? (
              <circle cx={x + w / 2} cy={y + h / 2} r={Math.min(w, h) * 0.3} className={line} strokeWidth={sw} />
            ) : (
              <line x1={x + w * 0.15} y1={y + h * 0.5} x2={x + w * 0.85} y2={y + h * 0.5} className={line} strokeWidth={sw * 0.6} />
            )}
          </>
        );
      case "sink":
        return (
          <>
            <rect x={x} y={y} width={w} height={h} className={base} strokeWidth={sw} />
            <rect x={x + w * 0.2} y={y + h * 0.2} width={w * 0.6} height={h * 0.6} rx={Math.min(w, h) * 0.2} className="fill-card stroke-plan-line" strokeWidth={sw * 0.7} />
          </>
        );
      case "stove":
        return (
          <>
            <rect x={x} y={y} width={w} height={h} className={base} strokeWidth={sw} />
            {[
              [0.3, 0.3],
              [0.7, 0.3],
              [0.3, 0.7],
              [0.7, 0.7],
            ].map(([px, py]) => (
              <circle key={`${px}-${py}`} cx={x + w * px} cy={y + h * py} r={Math.min(w, h) * 0.13} className={line} strokeWidth={sw * 0.7} />
            ))}
          </>
        );
      case "rug":
        return (
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx={r}
            className={cn(stroke, "fill-plan-rug")}
            strokeWidth={sw * 0.8}
            strokeDasharray={`${6 * k} ${4 * k}`}
          />
        );
      case "plant":
        return (
          <>
            <circle cx={x + w / 2} cy={y + h / 2} r={Math.min(w, h) / 2} className={cn(stroke, "fill-mat-sage")} strokeWidth={sw} />
            <circle cx={x + w / 2} cy={y + h / 2} r={Math.min(w, h) / 5} className="fill-plan-good/60" />
          </>
        );
      case "lamp":
        return (
          <>
            <circle cx={x + w / 2} cy={y + h / 2} r={Math.min(w, h) / 2} className={cn(stroke, "fill-light-warm")} strokeWidth={sw} />
            <path d={`M${x} ${y + h / 2}H${x + w}M${x + w / 2} ${y}V${y + h}`} className={line} strokeWidth={sw * 0.6} />
          </>
        );
      case "toilet":
        return (
          <>
            <rect x={x} y={y} width={w} height={h * 0.3} rx={3 * k} className={base} strokeWidth={sw} />
            <ellipse cx={x + w / 2} cy={y + h * 0.62} rx={w * 0.42} ry={h * 0.36} className={cn(stroke, "fill-card")} strokeWidth={sw} />
          </>
        );
      case "shower":
        return (
          <>
            <rect x={x} y={y} width={w} height={h} className={cn(stroke, "fill-mat-tile")} strokeWidth={sw} />
            <path d={`M${x} ${y}L${x + w} ${y + h}M${x + w} ${y}L${x} ${y + h}`} className={line} strokeWidth={sw * 0.5} />
          </>
        );
      case "bathtub":
        return (
          <>
            <rect x={x} y={y} width={w} height={h} rx={r} className={base} strokeWidth={sw} />
            <rect x={x + w * 0.08} y={y + h * 0.12} width={w * 0.84} height={h * 0.76} rx={Math.min(w, h) * 0.3} className="fill-mat-tile stroke-plan-line" strokeWidth={sw * 0.7} />
          </>
        );
      case "treadmill":
        return (
          <>
            <rect x={x} y={y} width={w} height={h} rx={r} className={base} strokeWidth={sw} />
            <rect x={x + w * 0.2} y={y + h * 0.15} width={w * 0.6} height={h * 0.7} className="fill-ink/70" />
          </>
        );
      case "person":
        return (
          <>
            <ellipse cx={x + w / 2} cy={y + h * 0.62} rx={w / 2} ry={h * 0.3} className="fill-primary stroke-ink" strokeWidth={sw * 0.8} />
            <circle cx={x + w / 2} cy={y + h * 0.3} r={Math.min(w, h) * 0.26} className="fill-skin-2 stroke-ink" strokeWidth={sw * 0.8} />
          </>
        );
      case "desk":
        return (
          <>
            <rect x={x} y={y} width={w} height={h} className={base} strokeWidth={sw} />
            <rect x={x + w * 0.3} y={y + h * 0.12} width={w * 0.4} height={Math.max(h * 0.1, 3 * k)} className="fill-ink/70" />
          </>
        );
      default:
        return <rect x={x} y={y} width={w} height={h} rx={kind === "island" || kind === "dining" ? r : 2 * k} className={base} strokeWidth={sw} />;
    }
  };

  const fontSize = label ? Math.min(13 * k, item.h * 0.42, (item.w / Math.max(label.length, 1)) * 1.15) : 0;

  return (
    <g className={cn(tone === "muted" && "opacity-40")}>
      {emphasized && (
        <rect
          x={item.x - 6 * k}
          y={item.y - 6 * k}
          width={item.w + 12 * k}
          height={item.h + 12 * k}
          rx={8 * k}
          className="fill-plan-highlight/50 stroke-plan-highlight"
          strokeWidth={2 * k}
        />
      )}
      <g transform={back === "top" ? undefined : `rotate(${backAngle[back]} ${cx} ${cy})`}>{detail()}</g>
      {label && fontSize >= 6 * k && kind !== "person" && (
        <text
          x={cx}
          y={cy}
          dominantBaseline="central"
          textAnchor="middle"
          fontSize={fontSize}
          className="pointer-events-none select-none fill-foreground font-medium"
          paintOrder="stroke"
          stroke="hsl(var(--plan-furniture))"
          strokeWidth={3 * k}
        >
          {label}
        </text>
      )}
    </g>
  );
}
