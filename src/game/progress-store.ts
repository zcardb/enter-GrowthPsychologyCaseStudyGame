/**
 * Local progress persistence. Falls back to in-memory state when
 * localStorage is unavailable (private mode, blocked storage, SSR).
 *
 * v1 payloads (cleared / attempts / seenPrinciples) are upgraded in place so
 * existing players keep their save.
 */

export interface Progress {
  version: 2;
  cleared: string[];
  attempts: Record<string, number>;
  seenPrinciples: string[];
  /** Levels cleared on the very first choice. */
  firstTry: string[];
  /** Failing option ids the player tried, per level. */
  mistakes: Record<string, string[]>;
  /** First-clear timestamp (ms). */
  clearedAt: Record<string, number>;
}

const KEY = "space-reasons:progress:v1";

const empty = (): Progress => ({
  version: 2,
  cleared: [],
  attempts: {},
  seenPrinciples: [],
  firstTry: [],
  mistakes: {},
  clearedAt: {},
});

const stringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((item): item is string => typeof item === "string") : [];

const numberRecord = (v: unknown): Record<string, number> => {
  if (typeof v !== "object" || v === null) return {};
  return Object.fromEntries(
    Object.entries(v as Record<string, unknown>).filter((entry): entry is [string, number] => typeof entry[1] === "number"),
  );
};

const stringArrayRecord = (v: unknown): Record<string, string[]> => {
  if (typeof v !== "object" || v === null) return {};
  return Object.fromEntries(Object.entries(v as Record<string, unknown>).map(([k, val]) => [k, stringArray(val)]));
};

/** Accepts v1 and v2 saves; unknown shapes fall back to an empty save. */
const normalize = (value: unknown): Progress => {
  if (typeof value !== "object" || value === null) return empty();
  const raw = value as Record<string, unknown>;
  if (raw.version !== 1 && raw.version !== 2) return empty();
  return {
    version: 2,
    cleared: stringArray(raw.cleared),
    attempts: numberRecord(raw.attempts),
    seenPrinciples: stringArray(raw.seenPrinciples),
    firstTry: stringArray(raw.firstTry),
    mistakes: stringArrayRecord(raw.mistakes),
    clearedAt: numberRecord(raw.clearedAt),
  };
};

const read = (): Progress => {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    return normalize(JSON.parse(raw));
  } catch {
    return empty();
  }
};

const write = (p: Progress) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Storage unavailable: keep playing with in-memory state.
  }
};

let state: Progress = typeof window === "undefined" ? empty() : read();
const listeners = new Set<() => void>();

export const progressStore = {
  get: () => state,
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  update(fn: (prev: Progress) => Progress) {
    state = fn(state);
    write(state);
    listeners.forEach((l) => l());
  },
  reset() {
    progressStore.update(() => empty());
  },
};
