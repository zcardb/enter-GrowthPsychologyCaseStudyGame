import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Check, Lock } from "lucide-react";
import { ScribbleCircle } from "@/components/comic/Doodle";
import type { Level } from "@/game/types";
import { cn } from "@/lib/utils";

interface LevelNodeProps {
  level: Level;
  number: number;
  state: "locked" | "cleared" | "current" | "open";
  chapterBg: string;
}

/** One level tile in the chapter directory. Locked tiles are not navigable. */
export function LevelNode({ level, number, state, chapterBg }: LevelNodeProps) {
  const { t } = useTranslation();
  const base =
    "group relative flex min-h-[78px] flex-col justify-between border-2 p-2 text-left transition-all doodle-card";
  const tilt = number % 3 === 0 ? "tilt-1" : number % 3 === 1 ? "tilt-2" : "tilt-l";

  if (state === "locked") {
    return (
      <div
        className={cn(base, "cursor-not-allowed border-dashed border-ink/25 bg-card/60 text-muted-foreground")}
        aria-disabled
        title={t("level.locked")}
        data-testid={`level-node-${level.id}`}
      >
        <span className="flex items-start justify-between">
          <span className="font-marker text-xl font-bold leading-none text-ink/40">{number}</span>
          <Lock className="h-3 w-3 text-ink/30" />
        </span>
        <span className="line-clamp-1 text-[11px] leading-snug text-ink/55">{level.title}</span>
      </div>
    );
  }

  return (
    <Link
      to={`/play/${level.id}`}
      data-testid={`level-node-${level.id}`}
      className={cn(
        base,
        "wobble-hover shadow-sticker",
        tilt,
        state === "cleared" && "fold-corner border-ink bg-success-soft",
        state === "current" && cn(chapterBg, "border-ink text-ink"),
        state === "open" && "fold-corner border-ink bg-card",
      )}
      aria-label={`${number}. ${level.title}${state === "cleared" ? ` · ${t("level.cleared")}` : ""}`}
    >
      <span className="flex items-start justify-between">
        <span className="relative inline-flex h-6 min-w-6 items-center justify-start pr-1">
          {state === "current" && (
            <ScribbleCircle className="-left-1 -top-1 h-8 w-8 text-ink/45" />
          )}
          <span className="relative font-marker text-2xl font-bold leading-none tabular-nums">{number}</span>
        </span>
        {state === "cleared" && (
          <span className="-rotate-6 rounded-full border-2 border-ink bg-success p-0.5 text-success-foreground shadow-[1px_2px_0_0_hsl(var(--ink))]">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        )}
        {state === "current" && (
          <span className="mt-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border-2 border-ink bg-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" />
          </span>
        )}
      </span>
      <span className="line-clamp-2 pt-1 text-[12px] font-bold leading-snug">{level.title}</span>
    </Link>
  );
}
