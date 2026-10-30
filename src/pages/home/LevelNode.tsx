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
    "group relative flex min-h-[76px] flex-col justify-between border-2 p-2 text-left transition-all doodle-card";
  const tilt = number % 3 === 0 ? "tilt-1" : number % 3 === 1 ? "tilt-2" : "tilt-l";

  if (state === "locked") {
    return (
      <div
        className={cn(base, "lock-hatch cursor-not-allowed border-dashed border-ink/30 bg-card/50 text-muted-foreground")}
        aria-disabled
        title={t("level.locked")}
        data-testid={`level-node-${level.id}`}
      >
        <span className="font-sans text-base font-extrabold leading-none">{number}</span>
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
        "wobble-hover shadow-sticker",
        tilt,
        state === "cleared" && "border-ink bg-card",
        state === "current" && cn(chapterBg, "border-ink text-ink"),
        state === "open" && "border-ink bg-card",
      )}
      aria-label={`${number}. ${level.title}${state === "cleared" ? ` · ${t("level.cleared")}` : ""}`}
    >
      <span className="flex items-start justify-between">
        <span className="font-sans text-base font-extrabold leading-none">{number}</span>
        {state === "cleared" && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink bg-success text-success-foreground">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        )}
        {state === "current" && (
          <span className="h-3 w-3 rotate-12 animate-pulse rounded-[3px] border-2 border-ink bg-accent" />
        )}
      </span>
      <span className="line-clamp-2 text-[12px] font-bold leading-snug">{level.title}</span>
    </Link>
  );
}
