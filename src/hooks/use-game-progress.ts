import { useCallback, useMemo, useSyncExternalStore } from "react";
import { unlockedAchievements, type Achievement } from "@/game/achievements";
import { isLevelUnlocked } from "@/game/level-flow";
import { LEVELS } from "@/game/levels";
import { progressStore } from "@/game/progress-store";

const ORDER = LEVELS.map((l) => l.id);

const unlockedIds = (): Set<string> => new Set(unlockedAchievements(progressStore.get()).map((a) => a.id));

/** Shared game progress: linear unlocks, attempts, principles seen, badges. */
export function useGameProgress() {
  const progress = useSyncExternalStore(progressStore.subscribe, progressStore.get, progressStore.get);

  const cleared = useMemo(() => new Set(progress.cleared), [progress.cleared]);

  const isUnlocked = useCallback((levelId: string) => isLevelUnlocked(ORDER, cleared, levelId), [cleared]);

  const currentLevelId = useMemo(() => ORDER.find((id) => !cleared.has(id)) ?? null, [cleared]);

  /** One choice: bumps the attempt count and remembers a failing pick. */
  const recordChoice = useCallback((levelId: string, optionId: string, passes: boolean) => {
    progressStore.update((p) => {
      const tried = p.mistakes[levelId] ?? [];
      const mistakes =
        passes || tried.includes(optionId) ? p.mistakes : { ...p.mistakes, [levelId]: [...tried, optionId] };
      return {
        ...p,
        attempts: { ...p.attempts, [levelId]: (p.attempts[levelId] ?? 0) + 1 },
        mistakes,
      };
    });
  }, []);

  /** Records the clear and returns the badges unlocked by it. */
  const completeLevel = useCallback((levelId: string, principleIds: string[]): Achievement[] => {
    const before = unlockedIds();
    progressStore.update((p) => {
      const wasCleared = p.cleared.includes(levelId);
      const clearedOnFirstTry = !wasCleared && (p.attempts[levelId] ?? 0) === 1 && !p.firstTry.includes(levelId);
      return {
        ...p,
        cleared: wasCleared ? p.cleared : [...p.cleared, levelId],
        seenPrinciples: Array.from(new Set([...p.seenPrinciples, ...principleIds])),
        firstTry: clearedOnFirstTry ? [...p.firstTry, levelId] : p.firstTry,
        clearedAt: wasCleared ? p.clearedAt : { ...p.clearedAt, [levelId]: Date.now() },
      };
    });
    return unlockedAchievements(progressStore.get()).filter((a) => !before.has(a.id));
  }, []);

  return {
    progress,
    cleared,
    clearedCount: cleared.size,
    total: LEVELS.length,
    currentLevelId,
    isUnlocked,
    recordChoice,
    completeLevel,
    resetAll: progressStore.reset,
  };
}
