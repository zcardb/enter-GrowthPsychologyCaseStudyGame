/** Pure level state machine: story → choice → outcome (fail → choice | pass → review). */

export type Stage = "story" | "choice" | "outcome" | "review";

export interface FlowState {
  stage: Stage;
  panel: number;
  chosenId: string | null;
  tried: string[];
}

export type FlowAction =
  | { type: "next"; panelCount: number }
  | { type: "prev" }
  | { type: "skip" }
  | { type: "choose"; optionId: string }
  | { type: "retry" }
  | { type: "review" }
  | { type: "replay" };

export const initialFlow: FlowState = { stage: "story", panel: 0, chosenId: null, tried: [] };

export function levelFlowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "next":
      return state.panel + 1 >= action.panelCount
        ? { ...state, stage: "choice" }
        : { ...state, panel: state.panel + 1 };
    case "prev":
      if (state.stage === "choice") return { ...state, stage: "story" };
      return { ...state, panel: Math.max(0, state.panel - 1) };
    case "skip":
      return { ...state, stage: "choice" };
    case "choose":
      return {
        ...state,
        stage: "outcome",
        chosenId: action.optionId,
        tried: state.tried.includes(action.optionId) ? state.tried : [...state.tried, action.optionId],
      };
    case "retry":
      return { ...state, stage: "choice", chosenId: null };
    case "review":
      return { ...state, stage: "review" };
    case "replay":
      return initialFlow;
  }
}

/** Linear unlock rule shared by the UI and tests. */
export function isLevelUnlocked(orderedIds: string[], cleared: ReadonlySet<string>, levelId: string): boolean {
  const idx = orderedIds.indexOf(levelId);
  if (idx < 0) return false;
  return idx === 0 || cleared.has(levelId) || cleared.has(orderedIds[idx - 1]);
}
