import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Check, Lock } from "lucide-react";
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
    "group relative flex min-h-[76px] flex-col justify-between rounded-md border-2 border-ink p-2 text-left transition-all";

  if (state === "locked") {
    return (
      <div
        className={cn(base, "cursor-not-allowed border-dashed border-ink/30 bg-muted/60 text-muted-foreground")}
        aria-disabled
        title={t("level.locked")}
        data-testid={`level-node-${level.id}`}
      >
        <span className="font-display text-lg font-black leading-none">{number}</span>
        <span className="flex items-center gap-1 text-[11px]">
          <Lock className="h-3 w-3" />
          <span className="line-clamp-1">{level.title}</span>
        </span>
      </div>
    );
  }

  return (
    <Link
      to={`/play/${level.id}`}
      data-testid={`level-node-${level.id}`}
      className={cn(
        base,
        "shadow-comic hover:-translate-y-0.5 hover:shadow-comic-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        state === "cleared" && "bg-card",
        state === "current" && cn(chapterBg, "text-primary-foreground"),
        state === "open" && "bg-card",
      )}
      aria-label={`${number}. ${level.title}${state === "cleared" ? ` · ${t("level.cleared")}` : ""}`}
    >
      <span className="flex items-start justify-between">
        <span className="font-display text-lg font-black leading-none">{number}</span>
        {state === "cleared" && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink bg-success text-success-foreground">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        )}
        {state === "current" && <span className="h-2.5 w-2.5 animate-pulse rounded-full border-2 border-ink bg-accent" />}
      </span>
      <span className="line-clamp-2 text-[12px] font-bold leading-snug">{level.title}</span>
    </Link>
  );
}
