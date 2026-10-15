import { useCallback, useMemo, useSyncExternalStore } from "react";
import { isLevelUnlocked } from "@/game/level-flow";
import { LEVELS } from "@/game/levels";
import { progressStore } from "@/game/progress-store";

const ORDER = LEVELS.map((l) => l.id);

/** Shared game progress: linear unlocks, attempts, principles seen. */
export function useGameProgress() {
  const progress = useSyncExternalStore(progressStore.subscribe, progressStore.get, progressStore.get);

  const cleared = useMemo(() => new Set(progress.cleared), [progress.cleared]);

  const isUnlocked = useCallback((levelId: string) => isLevelUnlocked(ORDER, cleared, levelId), [cleared]);

  const currentLevelId = useMemo(() => ORDER.find((id) => !cleared.has(id)) ?? null, [cleared]);

  const recordAttempt = useCallback((levelId: string) => {
    progressStore.update((p) => ({ ...p, attempts: { ...p.attempts, [levelId]: (p.attempts[levelId] ?? 0) + 1 } }));
  }, []);

  const completeLevel = useCallback((levelId: string, principleIds: string[]) => {
    progressStore.update((p) => ({
      ...p,
      cleared: p.cleared.includes(levelId) ? p.cleared : [...p.cleared, levelId],
      seenPrinciples: Array.from(new Set([...p.seenPrinciples, ...principleIds])),
    }));
  }, []);

  return {
    progress,
    cleared,
    clearedCount: cleared.size,
    total: LEVELS.length,
    currentLevelId,
    isUnlocked,
    recordAttempt,
    completeLevel,
    resetAll: progressStore.reset,
  };
}
