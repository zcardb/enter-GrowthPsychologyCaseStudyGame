import { useTranslation } from "react-i18next";
import { chapterBg, chapterMarker, chapterText, chapterTint } from "@/components/game/chapter-tone";
import { ProgressBar } from "@/components/game/ProgressBar";
import { RoughFrame } from "@/components/comic/RoughFrame";
import { ScribbleCircle } from "@/components/comic/Doodle";
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
    <section
      aria-labelledby={`ch-${chapter.id}`}
      className={cn(
        "doodle-card-alt relative border-2 border-ink p-4 shadow-[3px_4px_0_0_hsl(var(--ink)/0.14)] sm:p-5",
        chapterTint[chapter.tone],
      )}
    >
      <RoughFrame className="opacity-45" offset={3.5} />
      <div className="relative flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <ScribbleCircle className="text-ink/35" />
            <span
              className={cn(
                "sticker flex h-10 w-10 -rotate-6 items-center justify-center border-2 border-ink font-marker text-xl font-bold text-ink",
                chapterBg[chapter.tone],
              )}
            >
              {chapter.index}
            </span>
          </span>
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-wider", chapterText[chapter.tone])}>
              {t("home.chapter", { n: chapter.index })} · {chapter.subtitle}
            </p>
            <h2 id={`ch-${chapter.id}`} className="font-display text-2xl leading-tight">
              <span className={cn("marker", chapterMarker[chapter.tone])}>{chapter.title}</span>
            </h2>
          </div>
        </div>
        <div className="w-full text-right text-xs text-muted-foreground sm:w-44">
          <span className="font-marker text-base font-bold tabular-nums text-foreground">
            {t("home.chapterProgress", { done, total: levels.length })}
          </span>
          <ProgressBar value={done} max={levels.length} className="mt-1 h-2.5" barClassName={chapterBg[chapter.tone]} />
        </div>
      </div>
      <p className="relative mt-2 text-sm text-muted-foreground">{chapter.intro}</p>

      <div className="relative mt-4 grid grid-cols-2 gap-2.5 min-[420px]:grid-cols-3 sm:grid-cols-5">
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
