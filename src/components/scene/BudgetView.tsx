import type { BudgetScene, CostItem } from "@/game/types";
import { cn } from "@/lib/utils";

interface BudgetViewProps {
  scene: BudgetScene;
  emphasis?: ReadonlySet<string>;
  className?: string;
}

const barTone: Record<NonNullable<CostItem["tone"]>, string> = {
  fixed: "bg-chapter-4",
  flex: "bg-mat-sage",
  cut: "bg-muted-foreground/30",
  highlight: "bg-accent",
  problem: "bg-destructive",
};

const fmt = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1));

/** Budget breakdown: one bar per cost line, cap marker, total vs cap. */
export function BudgetView({ scene, emphasis, className }: BudgetViewProps) {
  const counted = scene.items.filter((i) => i.tone !== "cut");
  const total = counted.reduce((s, i) => s + i.amount, 0);
  const max = Math.max(...scene.items.map((i) => i.amount), 1);
  const over = total > scene.cap;
  const fill = Math.min(total / scene.cap, 1.25);

  return (
    <div className={cn("flex h-full w-full flex-col justify-center gap-3 p-3 sm:p-5", className)} role="img" aria-label="预算分配示意">
      <div className="doodle-card border-2 border-ink bg-card p-3 shadow-comic">
        <div className="flex items-baseline justify-between gap-2 text-sm">
          <span className="font-bold">合计</span>
          <span className={cn("font-sans text-xl font-extrabold tabular-nums", over ? "text-destructive" : "text-success")}>
            {fmt(total)}
            <span className="ml-1 text-xs font-medium text-muted-foreground">
              / 上限 {fmt(scene.cap)} {scene.unit}
            </span>
          </span>
        </div>
        <div className="doodle-pill relative mt-2 h-3.5 overflow-hidden border-2 border-ink bg-muted p-[2px]">
          <div
            className={cn("crayon-stripes doodle-pill h-full transition-all duration-500", over ? "bg-destructive" : "bg-success")}
            style={{ width: `${Math.min(fill, 1) * 100}%` }}
          />
        </div>
      </div>

      <ul className="flex flex-col gap-1.5">
        {scene.items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "grid grid-cols-[minmax(0,6.5rem)_1fr_auto] items-center gap-2 rounded-md px-1.5 py-1 text-xs sm:text-sm",
              emphasis?.has(item.id) && "bg-accent-soft ring-2 ring-plan-highlight",
            )}
          >
            <span className={cn("truncate font-medium", item.tone === "cut" && "text-muted-foreground line-through")}>
              {item.label}
            </span>
            <span className="h-3 overflow-hidden rounded-full bg-muted">
              <span
                className={cn("block h-full rounded-full border border-ink/40", barTone[item.tone ?? "flex"])}
                style={{ width: `${(item.amount / max) * 100}%` }}
              />
            </span>
            <span className="w-10 text-right tabular-nums text-muted-foreground">{fmt(item.amount)}</span>
            {item.note && <span className="col-span-3 -mt-0.5 pl-0.5 text-[11px] text-muted-foreground">{item.note}</span>}
          </li>
        ))}
      </ul>

      {scene.marks.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {scene.marks.map((m) => (
            <span
              key={m.id}
              className={cn(
                "rounded-full border-2 border-ink px-2 py-0.5 text-xs font-bold",
                m.tone === "problem" ? "bg-destructive text-destructive-foreground" : m.tone === "good" ? "bg-success text-success-foreground" : "bg-accent text-accent-foreground",
              )}
            >
              {m.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
