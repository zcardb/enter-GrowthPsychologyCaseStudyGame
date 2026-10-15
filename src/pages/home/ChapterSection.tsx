import { useTranslation } from "react-i18next";
import { chapterBg, chapterText } from "@/components/game/chapter-tone";
import { ProgressBar } from "@/components/game/ProgressBar";
import { levelNumber, levelsOfChapter } from "@/game/levels";
import type { Chapter } from "@/game/types";
import { useGameProgress } from "@/hooks/use-game-progress";
import { cn } from "@/lib/utils";
import { LevelNode } from "./LevelNode";

export function ChapterSection({ chapter }: { chapter: Chapter }) {
  const { t } = useTranslation();
  const { cleared, isUnlocked, currentLevelId } = useGameProgress();
  const levels = levelsOfChapter(chapter.id);
  const done = levels.filter((l) => cleared.has(l.id)).length;

  return (
    <section aria-labelledby={`ch-${chapter.id}`} className="rounded-lg border-2 border-ink bg-card/70 p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-md border-2 border-ink font-display text-2xl font-black text-primary-foreground shadow-comic",
              chapterBg[chapter.tone],
            )}
          >
            {chapter.index}
          </span>
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-wider", chapterText[chapter.tone])}>
              {t("home.chapter", { n: chapter.index })} · {chapter.subtitle}
            </p>
            <h2 id={`ch-${chapter.id}`} className="font-display text-2xl font-black leading-tight">
              {chapter.title}
            </h2>
          </div>
        </div>
        <div className="w-full max-w-[180px] text-right text-xs text-muted-foreground sm:w-44">
          {t("home.chapterProgress", { done, total: levels.length })}
          <ProgressBar value={done} max={levels.length} className="mt-1 h-2.5" barClassName={chapterBg[chapter.tone]} />
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{chapter.intro}</p>

      <div className="mt-4 grid grid-cols-2 gap-2.5 min-[420px]:grid-cols-3 sm:grid-cols-5">
        {levels.map((level) => (
          <LevelNode
            key={level.id}
            level={level}
            number={levelNumber(level.id)}
            chapterBg={chapterBg[chapter.tone]}
            state={
              cleared.has(level.id)
                ? "cleared"
                : level.id === currentLevelId
                  ? "current"
                  : isUnlocked(level.id)
                    ? "open"
                    : "locked"
            }
          />
        ))}
      </div>
    </section>
  );
}
