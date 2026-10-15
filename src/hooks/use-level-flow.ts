import { useReducer } from "react";
import { initialFlow, levelFlowReducer } from "@/game/level-flow";

export type { Stage } from "@/game/level-flow";

/** Level state machine: story → choice → outcome (fail → choice | pass → review). */
export function useLevelFlow() {
  return useReducer(levelFlowReducer, initialFlow);
}
