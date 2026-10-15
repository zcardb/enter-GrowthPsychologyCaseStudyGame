import type { Chapter } from "./types";

export const CHAPTERS: Chapter[] = [
  {
    id: "c1",
    index: 1,
    title: "户型与动线",
    subtitle: "Layout & Flow",
    intro: "床放哪、路怎么走、墙能不能拆——先把空间的骨架理顺。",
    tone: 1,
  },
  {
    id: "c2",
    index: 2,
    title: "收纳与日常",
    subtitle: "Storage & Habits",
    intro: "东西放在哪里，决定了一家人每天怎么生活。",
    tone: 2,
  },
  {
    id: "c3",
    index: 3,
    title: "光线与感受",
    subtitle: "Light & Feeling",
    intro: "同一个房间，换一种光，就换了一种心情。",
    tone: 3,
  },
  {
    id: "c4",
    index: 4,
    title: "材质与风格",
    subtitle: "Material & Style",
    intro: "好看之外，还要扛得住孩子、宠物和十年的日常。",
    tone: 4,
  },
  {
    id: "c5",
    index: 5,
    title: "预算与取舍",
    subtitle: "Budget & Trade-offs",
    intro: "钱有限的时候，先花在哪里，比花多少更重要。",
    tone: 5,
  },
];

export const chapterById = new Map(CHAPTERS.map((c) => [c.id, c]));
