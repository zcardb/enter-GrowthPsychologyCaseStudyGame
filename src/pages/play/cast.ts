import type { CastMember, Level, Speaker } from "@/game/types";
import { DESIGNER } from "@/game/designer";

/** Resolve a panel speaker to a cast member (null = narrator). */
export const castFor = (level: Level, speaker: Speaker): CastMember | null => {
  switch (speaker) {
    case "client":
      return level.client;
    case "partner":
      return level.partner ?? level.client;
    case "designer":
      return DESIGNER;
    case "narrator":
      return null;
  }
};
