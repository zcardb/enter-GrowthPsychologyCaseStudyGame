import type { Chapter } from "@/game/types";

/** Literal chapter color classes (Tailwind needs to see full class names). */
export const chapterBg: Record<Chapter["tone"], string> = {
  1: "bg-chapter-1",
  2: "bg-chapter-2",
  3: "bg-chapter-3",
  4: "bg-chapter-4",
  5: "bg-chapter-5",
};

export const chapterText: Record<Chapter["tone"], string> = {
  1: "text-chapter-1",
  2: "text-chapter-2",
  3: "text-chapter-3",
  4: "text-chapter-4",
  5: "text-chapter-5",
};
