import { LEVELS } from "./levels";
import { PRINCIPLES } from "./principles";
import { summarizeProgress, type ProgressSummary } from "./progress-summary";
import type { Progress } from "./progress-store";

export type AchievementIcon =
  | "flag"
  | "compass"
  | "boxes"
  | "sun"
  | "layers"
  | "wallet"
  | "zap"
  | "eye"
  | "bulb"
  | "book"
  | "trophy";

export type AchievementTone = 1 | 2 | 3 | 4 | 5 | "primary" | "accent" | "secondary" | "success";

export interface Achievement {
  id: string;
  icon: AchievementIcon;
  tone: AchievementTone;
  /** Goal shown as `value / target` while locked. */
  target: number;
  value: (summary: ProgressSummary) => number;
}

export interface AchievementState {
  achievement: Achievement;
  value: number;
  unlocked: boolean;
}

const chapterDone = (chapterId: string) => (summary: ProgressSummary) =>
  summary.chapters.find((item) => item.chapter.id === chapterId)?.done ?? 0;

const chapterTotal = (chapterId: string) => LEVELS.filter((level) => level.chapterId === chapterId).length;

/** 11 badges, all derived from the save — no separate unlock store. */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-clear",
    icon: "flag",
    tone: "primary",
    target: 1,
    value: (s) => s.clearedCount,
  },
  {
    id: "chapter-c1",
    icon: "compass",
    tone: 1,
    target: chapterTotal("c1"),
    value: chapterDone("c1"),
  },
  {
    id: "chapter-c2",
    icon: "boxes",
    tone: 2,
    target: chapterTotal("c2"),
    value: chapterDone("c2"),
  },
  {
    id: "chapter-c3",
    icon: "sun",
    tone: 3,
    target: chapterTotal("c3"),
    value: chapterDone("c3"),
  },
  {
    id: "chapter-c4",
    icon: "layers",
    tone: 4,
    target: chapterTotal("c4"),
    value: chapterDone("c4"),
  },
  {
    id: "chapter-c5",
    icon: "wallet",
    tone: 5,
    target: chapterTotal("c5"),
    value: chapterDone("c5"),
  },
  {
    id: "first-try-5",
    icon: "zap",
    tone: "accent",
    target: 5,
    value: (s) => s.firstTryCount,
  },
  {
    id: "first-try-15",
    icon: "eye",
    tone: "accent",
    target: 15,
    value: (s) => s.firstTryCount,
  },
  {
    id: "principles-10",
    icon: "bulb",
    tone: "secondary",
    target: 10,
    value: (s) => s.seenCount,
  },
  {
    id: "principles-all",
    icon: "book",
    tone: "secondary",
    target: PRINCIPLES.length,
    value: (s) => s.seenCount,
  },
  {
    id: "all-clear",
    icon: "trophy",
    tone: "success",
    target: LEVELS.length,
    value: (s) => s.clearedCount,
  },
];

export function evaluateAchievements(progress: Progress): AchievementState[] {
  const summary = summarizeProgress(progress);
  return ACHIEVEMENTS.map((achievement) => {
    const value = achievement.value(summary);
    return { achievement, value, unlocked: value >= achievement.target };
  });
}

export function unlockedAchievements(progress: Progress): Achievement[] {
  return evaluateAchievements(progress)
    .filter((state) => state.unlocked)
    .map((state) => state.achievement);
}
