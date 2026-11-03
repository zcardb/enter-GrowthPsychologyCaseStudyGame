import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { chapterBg, chapterText, chapterTint } from "@/components/game/chapter-tone";
import { ProgressBar } from "@/components/game/ProgressBar";
import type { ChapterProgress } from "@/game/progress-summary";
import { cn } from "@/lib/utils";

/** One row per chapter: sticker index, hand-drawn progress, completion mark. */
export function ChapterReport({ chapters }: { chapters: ChapterProgress[] }) {
  const { t } = useTranslation();

  return (
    <div className="mt-3 flex flex-col gap-3">
      {chapters.map(({ chapter, done, total, complete }) => (
        <div
          key={chapter.id}
          className={cn(
            "doodle-card-alt border-2 border-ink p-3 shadow-[3px_3px_0_0_hsl(var(--ink)/0.12)]",
            chapterTint[chapter.tone],
          )}
          data-testid={`progress-chapter-${chapter.id}`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "sticker flex h-8 w-8 shrink-0 -rotate-3 items-center justify-center border-2 border-ink font-display text-base text-ink",
                chapterBg[chapter.tone],
              )}
            >
              {chapter.index}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base leading-tight">{chapter.title}</p>
              <p className={cn("truncate text-[11px] font-bold uppercase tracking-wide", chapterText[chapter.tone])}>
                {chapter.subtitle}
              </p>
            </div>
            <span className="shrink-0 font-sans text-sm font-extrabold tabular-nums">
              {done}
              <span className="text-xs font-medium text-muted-foreground"> / {total}</span>
            </span>
          </div>
          <ProgressBar value={done} max={total} className="mt-2 h-2.5" barClassName={chapterBg[chapter.tone]} />
          {complete && (
            <p className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-primary-ink">
              <Check className="h-3 w-3" strokeWidth={3} />
              {t("progress.chapterDone")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
