import type { Chapter } from "@/game/types";

/** Literal chapter color classes (Tailwind needs to see full class names). */
export const chapterBg: Record<Chapter["tone"], string> = {
  1: "bg-chapter-1",
  2: "bg-chapter-2",
  3: "bg-chapter-3",
  4: "bg-chapter-4",
  5: "bg-chapter-5",
};

/** Deeper chapter inks for small text on cream paper (pastels fail contrast alone). */
export const chapterText: Record<Chapter["tone"], string> = {
  1: "chapter-ink-1",
  2: "chapter-ink-2",
  3: "chapter-ink-3",
  4: "chapter-ink-4",
  5: "chapter-ink-5",
};

/** Soft macaron wash behind each chapter block. */
export const chapterTint: Record<Chapter["tone"], string> = {
  1: "bg-chapter-1/15",
  2: "bg-chapter-2/20",
  3: "bg-chapter-3/20",
  4: "bg-chapter-4/25",
  5: "bg-chapter-5/20",
};

/** Highlighter swipe that matches the chapter color. */
export const chapterMarker: Record<Chapter["tone"], string> = {
  1: "marker-ch-1",
  2: "marker-ch-2",
  3: "marker-ch-3",
  4: "marker-ch-4",
  5: "marker-ch-5",
};
