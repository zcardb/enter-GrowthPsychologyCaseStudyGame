/**
 * Local progress persistence. Falls back to in-memory state when
 * localStorage is unavailable (private mode, blocked storage, SSR).
 */

export interface Progress {
  version: 1;
  cleared: string[];
  attempts: Record<string, number>;
  seenPrinciples: string[];
}

const KEY = "space-reasons:progress:v1";

const empty = (): Progress => ({ version: 1, cleared: [], attempts: {}, seenPrinciples: [] });

const isProgress = (v: unknown): v is Progress =>
  typeof v === "object" &&
  v !== null &&
  (v as Progress).version === 1 &&
  Array.isArray((v as Progress).cleared) &&
  Array.isArray((v as Progress).seenPrinciples) &&
  typeof (v as Progress).attempts === "object";

const read = (): Progress => {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed: unknown = JSON.parse(raw);
    return isProgress(parsed) ? parsed : empty();
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
