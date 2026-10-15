import type { Scene, SceneOp } from "../types";

type Collection = { id: string }[];

const upsert = <T extends { id: string }>(list: T[], value: T): T[] => {
  const idx = list.findIndex((el) => el.id === value.id);
  if (idx === -1) return [...list, value];
  const next = [...list];
  next[idx] = value;
  return next;
};

const collectionsOf = (scene: Scene): Record<string, Collection> => {
  switch (scene.kind) {
    case "plan":
      return {
        walls: scene.walls,
        doors: scene.doors,
        windows: scene.windows,
        items: scene.items,
        flows: scene.flows,
        zones: scene.zones,
        marks: scene.marks,
      };
    case "elevation":
      return { items: scene.items, lights: scene.lights, marks: scene.marks };
    case "budget":
      return { items: scene.items, marks: scene.marks };
  }
};

/** Collection key an op writes to, per scene kind. */
const targetKey = (scene: Scene, op: SceneOp): string | null => {
  switch (op.op) {
    case "item":
      return scene.kind === "plan" ? "items" : null;
    case "wall":
      return scene.kind === "plan" ? "walls" : null;
    case "door":
      return scene.kind === "plan" ? "doors" : null;
    case "window":
      return scene.kind === "plan" ? "windows" : null;
    case "flow":
      return scene.kind === "plan" ? "flows" : null;
    case "zone":
      return scene.kind === "plan" ? "zones" : null;
    case "elev":
      return scene.kind === "elevation" ? "items" : null;
    case "light":
      return scene.kind === "elevation" ? "lights" : null;
    case "cost":
      return scene.kind === "budget" ? "items" : null;
    case "mark":
      return "marks";
    default:
      return null;
  }
};

export interface AppliedScene {
  scene: Scene;
  changedIds: Set<string>;
}

/** Pure: base scene + ops → new scene, plus the ids that changed (for highlighting). */
export function applyOps(base: Scene, ops: SceneOp[]): AppliedScene {
  let scene: Scene = base;
  const changedIds = new Set<string>();

  for (const op of ops) {
    if (op.op === "surface" && scene.kind === "elevation") {
      scene = { ...scene, wall: op.wall ?? scene.wall, floor: op.floor ?? scene.floor };
      changedIds.add("__surface");
      continue;
    }
    if (op.op === "ambient" && scene.kind === "elevation") {
      scene = { ...scene, ambient: op.value, daylight: op.daylight ?? scene.daylight };
      continue;
    }
    if (op.op === "cap" && scene.kind === "budget") {
      scene = { ...scene, cap: op.value };
      continue;
    }

    const cols = collectionsOf(scene);

    if (op.op === "remove" || op.op === "patch") {
      for (const [key, list] of Object.entries(cols)) {
        if (!list.some((el) => el.id === op.id)) continue;
        const next =
          op.op === "remove"
            ? list.filter((el) => el.id !== op.id)
            : list.map((el) => (el.id === op.id ? { ...el, ...op.set } : el));
        scene = { ...scene, [key]: next } as Scene;
        if (op.op === "patch") changedIds.add(op.id);
      }
      continue;
    }

    const key = targetKey(scene, op);
    if (!key || !("value" in op) || typeof op.value !== "object") continue;
    scene = { ...scene, [key]: upsert(cols[key], op.value) } as Scene;
    changedIds.add(op.value.id);
  }

  return { scene, changedIds };
}

/** Ids referenced by ops that do not exist in the base scene (for content validation). */
export function danglingRefs(base: Scene, ops: SceneOp[]): string[] {
  const ids = new Set(Object.values(collectionsOf(base)).flatMap((l) => l.map((el) => el.id)));
  const added = new Set<string>();
  const missing: string[] = [];
  for (const op of ops) {
    if (op.op === "remove" || op.op === "patch") {
      if (!ids.has(op.id) && !added.has(op.id)) missing.push(op.id);
    } else if ("value" in op && typeof op.value === "object") {
      if (targetKey(base, op) === null) missing.push(`${op.op}:${op.value.id}(kind mismatch)`);
      added.add(op.value.id);
    }
  }
  return missing;
}
