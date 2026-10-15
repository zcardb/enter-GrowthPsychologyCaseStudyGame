/**
 * Terse builders for authoring level scenes and option ops.
 * Units: centimetres for plans / elevations; budget amounts in the scene's unit.
 */
import type {
  BudgetScene,
  CostItem,
  ElementTone,
  ElevItem,
  ElevKind,
  ElevationScene,
  Flow,
  FurnitureKind,
  Light,
  Mark,
  MaterialTone,
  Opening,
  PlanItem,
  PlanScene,
  SceneOp,
  Wall,
  Zone,
} from "../types";

type PlanParts = Partial<Omit<PlanScene, "kind" | "width" | "height">>;

export const plan = (width: number, height: number, parts: PlanParts = {}): PlanScene => ({
  kind: "plan",
  width,
  height,
  walls: [],
  doors: [],
  windows: [],
  items: [],
  flows: [],
  zones: [],
  marks: [],
  ...parts,
});

type ElevParts = Partial<Omit<ElevationScene, "kind">>;

export const elevation = (parts: ElevParts = {}): ElevationScene => ({
  kind: "elevation",
  width: 420,
  height: 270,
  wall: "paper",
  floor: "oak",
  ambient: 0.85,
  daylight: "none",
  items: [],
  lights: [],
  marks: [],
  ...parts,
});

export const budget = (cap: number, items: CostItem[], unit = "万元"): BudgetScene => ({
  kind: "budget",
  cap,
  unit,
  items,
  marks: [],
});

export const it = (
  id: string,
  kind: FurnitureKind,
  x: number,
  y: number,
  w: number,
  h: number,
  label?: string,
  tone?: ElementTone,
  back?: PlanItem["back"],
): PlanItem => ({ id, kind, x, y, w, h, label, tone, back });

export const wall = (id: string, x1: number, y1: number, x2: number, y2: number, bearing = false): Wall => ({
  id,
  x1,
  y1,
  x2,
  y2,
  bearing,
});

export const door = (id: string, x: number, y: number, w: number, orient: "h" | "v"): Opening => ({
  id,
  x,
  y,
  w,
  orient,
});

export const win = door;

export const flow = (id: string, tone: Flow["tone"], points: [number, number][], label?: string): Flow => ({
  id,
  tone,
  points,
  label,
});

export const zone = (
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  tone?: ElementTone,
): Zone => ({ id, x, y, w, h, label, tone });

export const mark = (id: string, x: number, y: number, label: string, tone?: ElementTone): Mark => ({
  id,
  x,
  y,
  label,
  tone,
});

export const el = (
  id: string,
  kind: ElevKind,
  x: number,
  y: number,
  w: number,
  h: number,
  tone?: MaterialTone,
  label?: string,
  state?: ElementTone,
): ElevItem => ({ id, kind, x, y, w, h, tone, label, state });

export const light = (
  id: string,
  layer: Light["layer"],
  x: number,
  y: number,
  r: number,
  warmth: Light["warmth"] = "warm",
  label?: string,
): Light => ({ id, layer, x, y, r, warmth, label });

export const cost = (
  id: string,
  label: string,
  amount: number,
  tone?: CostItem["tone"],
  note?: string,
): CostItem => ({ id, label, amount, tone, note });

/** Option op helpers. */
export const o = {
  rm: (id: string): SceneOp => ({ op: "remove", id }),
  set: (id: string, set: Record<string, unknown>): SceneOp => ({ op: "patch", id, set }),
  patch: (id: string, set: Record<string, unknown>): SceneOp => ({ op: "patch", id, set }),
  move: (id: string, x: number, y: number, extra: Record<string, unknown> = {}): SceneOp => ({
    op: "patch",
    id,
    set: { x, y, ...extra },
  }),
  item: (value: PlanItem): SceneOp => ({ op: "item", value }),
  wall: (value: Wall): SceneOp => ({ op: "wall", value }),
  door: (value: Opening): SceneOp => ({ op: "door", value }),
  window: (value: Opening): SceneOp => ({ op: "window", value }),
  flow: (value: Flow): SceneOp => ({ op: "flow", value }),
  zone: (value: Zone): SceneOp => ({ op: "zone", value }),
  mark: (value: Mark): SceneOp => ({ op: "mark", value }),
  elev: (value: ElevItem): SceneOp => ({ op: "elev", value }),
  light: (value: Light): SceneOp => ({ op: "light", value }),
  cost: (value: CostItem): SceneOp => ({ op: "cost", value }),
  surface: (wall?: MaterialTone, floor?: MaterialTone): SceneOp => ({ op: "surface", wall, floor }),
  ambient: (value: number, daylight?: ElevationScene["daylight"]): SceneOp => ({ op: "ambient", value, daylight }),
  cap: (value: number): SceneOp => ({ op: "cap", value }),
};
