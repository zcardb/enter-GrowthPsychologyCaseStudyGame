import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { BeforeAfter } from "@/components/scene/BeforeAfter";
import { SceneView } from "@/components/scene/SceneView";
import { chapterById } from "@/game/chapters";
import { levelNumber } from "@/game/levels";
import { applyOps } from "@/game/scenes/apply-ops";
import type { Level } from "@/game/types";
import { useGameProgress } from "@/hooks/use-game-progress";
import { useLevelFlow } from "@/hooks/use-level-flow";
import { ChoiceStage } from "./ChoiceStage";
import { LevelTopBar } from "./LevelTopBar";
import { OutcomeStage } from "./OutcomeStage";
import { ReviewStage } from "./ReviewStage";
import { StoryStage } from "./StoryStage";

/** Owns one level's state machine and the two-pane (scene + text) layout. */
export function LevelPlayer({ level }: { level: Level }) {
  const [state, dispatch] = useLevelFlow();
  const { t } = useTranslation();
  const { recordAttempt } = useGameProgress();
  const chapter = chapterById.get(level.chapterId)!;
  const option = level.options.find((o) => o.id === state.chosenId) ?? null;
  const applied = useMemo(() => (option ? applyOps(level.base, option.ops) : null), [level.base, option]);
  const focus = useMemo(
    () => new Set(state.stage === "story" ? (level.panels[state.panel].focus ?? []) : []),
    [level.panels, state.panel, state.stage],
  );

  const choose = (id: string) => {
    recordAttempt(level.id);
    dispatch({ type: "choose", optionId: id });
  };

  const scene =
    applied && option && (state.stage === "outcome" || state.stage === "review") ? (
      <BeforeAfter before={level.base} after={applied.scene} changed={applied.changedIds} />
    ) : (
      <SceneView scene={level.base} emphasis={focus} />
    );

  return (
    <div className="pt-safe pb-safe px-safe flex h-[100dvh] flex-col overflow-hidden">
      <LevelTopBar level={level} chapter={chapter} number={levelNumber(level.id)} stage={state.stage} />

      <main className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-rows-[minmax(26dvh,1fr)_minmax(0,auto)] gap-3 landscape:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] landscape:grid-rows-1 landscape:gap-4">
        <section
          className="paper-dots relative min-h-0 overflow-hidden rounded-lg border-2 border-ink bg-card shadow-comic"
          aria-label={t("play.sceneLabel")}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${state.stage === "outcome" || state.stage === "review" ? `after-${state.chosenId}` : "base"}`}
              className="absolute inset-0 p-1.5"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {scene}
            </motion.div>
          </AnimatePresence>
        </section>

        <section className="flex max-h-[58dvh] min-h-0 flex-col landscape:max-h-none" aria-live="polite">
          {state.stage === "story" && (
            <StoryStage
              level={level}
              panel={state.panel}
              onNext={() => dispatch({ type: "next", panelCount: level.panels.length })}
              onPrev={() => dispatch({ type: "prev" })}
              onSkip={() => dispatch({ type: "skip" })}
            />
          )}
          {state.stage === "choice" && (
            <ChoiceStage level={level} tried={state.tried} onChoose={choose} onBack={() => dispatch({ type: "prev" })} />
          )}
          {state.stage === "outcome" && option && (
            <OutcomeStage
              level={level}
              option={option}
              onRetry={() => dispatch({ type: "retry" })}
              onReview={() => dispatch({ type: "review" })}
            />
          )}
          {state.stage === "review" && option && (
            <ReviewStage
              level={level}
              option={option}
              attempts={state.tried.length}
              onReplay={() => dispatch({ type: "replay" })}
            />
          )}
        </section>
      </main>
    </div>
  );
}
