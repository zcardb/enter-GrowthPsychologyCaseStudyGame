import type { CharacterLook } from "@/game/types";

/** The player's designer avatar — recurring across all levels. */
export const DESIGNER = {
  name: "你",
  role: "设计师",
  look: { hair: "bob", hairTone: 1, skin: 1, outfit: "ink", accessory: "glasses" } satisfies CharacterLook,
};
