import { CHAPTERS } from "./chapters";
import { LEVELS, levelsOfChapter } from "./levels";
import { PRINCIPLES } from "./principles";
import type { Progress } from "./progress-store";
import type { Chapter, Level } from "./types";

export interface ChapterProgress {
  chapter: Chapter;
  done: number;
  total: number;
  complete: boolean;
}

export interface ReviewItem {
  level: Level;
  attempts: number;
  mistakeCount: number;
  cleared: boolean;
}

export interface ProgressSummary {
  total: number;
  clearedCount: number;
  firstTryCount: number;
  totalAttempts: number;
  mistakeCount: number;
  seenCount: number;
  principleTotal: number;
  chapters: ChapterProgress[];
  /** Levels worth a second look: repeated attempts or a wrong pick. */
  reviewLevels: ReviewItem[];
}

/** Pure stats for the progress report and achievement evaluation. */
export function summarizeProgress(progress: Progress): ProgressSummary {
  const cleared = new Set(progress.cleared);

  const chapters = CHAPTERS.map((chapter) => {
    const levels = levelsOfChapter(chapter.id);
    const done = levels.filter((level) => cleared.has(level.id)).length;
    return { chapter, done, total: levels.length, complete: levels.length > 0 && done === levels.length };
  });

  const seen = new Set(progress.seenPrinciples);
  const principleTotal = PRINCIPLES.length;

  const reviewLevels = LEVELS.map((level) => {
    const attempts = progress.attempts[level.id] ?? 0;
    const mistakeCount = progress.mistakes[level.id]?.length ?? 0;
    return { level, attempts, mistakeCount, cleared: cleared.has(level.id) };
  })
    .filter((item) => item.attempts >= 2 || item.mistakeCount > 0)
    .sort((a, b) => b.attempts - a.attempts || b.mistakeCount - a.mistakeCount);

  return {
    total: LEVELS.length,
    clearedCount: cleared.size,
    firstTryCount: progress.firstTry.filter((id) => cleared.has(id)).length,
    totalAttempts: Object.values(progress.attempts).reduce((sum, n) => sum + n, 0),
    mistakeCount: Object.values(progress.mistakes).reduce((sum, ids) => sum + ids.length, 0),
    seenCount: PRINCIPLES.filter((principle) => seen.has(principle.id)).length,
    principleTotal,
    chapters,
    reviewLevels,
  };
}
