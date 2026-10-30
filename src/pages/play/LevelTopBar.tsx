import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chapterBg } from "@/components/game/chapter-tone";
import type { Chapter, Level } from "@/game/types";
import type { Stage } from "@/hooks/use-level-flow";
import { cn } from "@/lib/utils";

const STAGES: Stage[] = ["story", "choice", "outcome", "review"];

interface LevelTopBarProps {
  level: Level;
  chapter: Chapter;
  number: number;
  stage: Stage;
}

export function LevelTopBar({ level, chapter, number, stage }: LevelTopBarProps) {
  const { t } = useTranslation();
  const current = STAGES.indexOf(stage);

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center gap-2 pb-2">
      <Button asChild variant="comicLight" size="iconTouch" className="shrink-0" data-testid="play-back">
        <Link to="/" aria-label={t("play.back")}>
          <ArrowLeft />
        </Link>
      </Button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
          <span className={cn("h-2.5 w-2.5 shrink-0 rotate-12 rounded-[3px] border border-ink/60", chapterBg[chapter.tone])} />
          <span className="truncate">
            {chapter.title} · {t("play.levelNo", { n: number })}
          </span>
        </div>
        <h1 className="truncate font-display text-lg leading-tight sm:text-xl">{level.title}</h1>
      </div>
      <ol className="flex shrink-0 items-center gap-1" aria-label={t("play.stages")}>
        {STAGES.map((s, i) => (
          <li
            key={s}
            className={cn(
              "doodle-pill border-2 px-1.5 py-0.5 text-[10px] font-bold leading-none transition-colors sm:px-2 sm:text-[11px]",
              i < current && "border-ink bg-ink text-paper",
              i === current && "-rotate-2 border-ink bg-accent text-accent-foreground shadow-[2px_2px_0_0_hsl(var(--ink))]",
              i > current && "border-ink/20 text-muted-foreground",
            )}
            aria-current={i === current ? "step" : undefined}
          >
            {t(`play.stage.${s}`)}
          </li>
        ))}
      </ol>
    </header>
  );
}
