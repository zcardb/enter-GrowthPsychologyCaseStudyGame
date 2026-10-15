import type { Level } from "../types";
import { CHAPTER_1 } from "./chapter1";
import { CHAPTER_2 } from "./chapter2";
import { CHAPTER_3 } from "./chapter3";
import { CHAPTER_4 } from "./chapter4";
import { CHAPTER_5 } from "./chapter5";

/** All levels in play order. */
export const LEVELS: Level[] = [...CHAPTER_1, ...CHAPTER_2, ...CHAPTER_3, ...CHAPTER_4, ...CHAPTER_5];

export const levelById = new Map(LEVELS.map((l) => [l.id, l]));

export const levelNumber = (id: string) => LEVELS.findIndex((l) => l.id === id) + 1;

export const nextLevelId = (id: string): string | null => {
  const idx = LEVELS.findIndex((l) => l.id === id);
  return idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1].id : null;
};

export const levelsOfChapter = (chapterId: string) => LEVELS.filter((l) => l.chapterId === chapterId);

/** Every level that references a principle. */
export const levelsUsingPrinciple = (principleId: string) => LEVELS.filter((l) => l.principleIds.includes(principleId));
