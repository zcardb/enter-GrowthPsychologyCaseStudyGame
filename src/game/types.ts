/**
 * Content model for 《空间的理由》.
 * Levels are pure data; the engine (hooks + stages) only reads these types.
 */

export type Mood = "neutral" | "happy" | "worried" | "annoyed" | "surprised";

export type OutfitTone = "terracotta" | "sage" | "mustard" | "slate" | "berry" | "ink" | "linen";

export interface CharacterLook {
  hair: "short" | "long" | "bun" | "curly" | "bald" | "bob" | "ponytail";
  hairTone: 1 | 2 | 3 | 4;
  skin: 1 | 2 | 3;
  outfit: OutfitTone;
  accessory?: "glasses" | "beard" | "cap" | "earring" | "none";
  age?: "kid" | "adult" | "elder";
}

export interface CastMember {
  name: string;
  role: string;
  look: CharacterLook;
}

export type Speaker = "client" | "partner" | "designer" | "narrator";

export interface Panel {
  speaker: Speaker;
  mood: Mood;
  text: string;
  /** Element ids in the base scene to highlight while this panel is shown. */
  focus?: string[];
}

/* ---------------- Scenes ---------------- */

export type MaterialTone =
  | "paper"
  | "white"
  | "oak"
  | "walnut"
  | "concrete"
  | "terrazzo"
  | "sage"
  | "terracotta"
  | "navy"
  | "mustard"
  | "linen"
  | "stone"
  | "tile"
  | "pink"
  | "charcoal"
  | "mirror";

export type ElementTone = "default" | "highlight" | "problem" | "good" | "muted";

export type FurnitureKind =
  | "sofa"
  | "armchair"
  | "bed"
  | "bunk"
  | "crib"
  | "table"
  | "dining"
  | "chair"
  | "desk"
  | "wardrobe"
  | "cabinet"
  | "shelf"
  | "tv"
  | "fridge"
  | "sink"
  | "stove"
  | "counter"
  | "island"
  | "rug"
  | "plant"
  | "lamp"
  | "toilet"
  | "shower"
  | "bathtub"
  | "washer"
  | "shoe"
  | "bench"
  | "partition"
  | "person"
  | "box"
  | "treadmill"
  | "mirror";

export interface PlanItem {
  id: string;
  kind: FurnitureKind;
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  tone?: ElementTone;
  /** Side the backrest / headboard faces. Defaults to "top". */
  back?: "top" | "right" | "bottom" | "left";
}

export interface Wall {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Load-bearing walls render hatched. */
  bearing?: boolean;
  tone?: ElementTone;
}

export interface Opening {
  id: string;
  x: number;
  y: number;
  w: number;
  orient: "h" | "v";
}

export interface Flow {
  id: string;
  points: [number, number][];
  tone: "good" | "bad";
  label?: string;
}

export interface Zone {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  tone?: ElementTone;
}

export interface Mark {
  id: string;
  x: number;
  y: number;
  label: string;
  tone?: ElementTone;
}

export interface PlanScene {
  kind: "plan";
  width: number;
  height: number;
  walls: Wall[];
  doors: Opening[];
  windows: Opening[];
  items: PlanItem[];
  flows: Flow[];
  zones: Zone[];
  marks: Mark[];
}

export type ElevKind =
  | "sofa"
  | "bed"
  | "cabinet"
  | "tv"
  | "shelf"
  | "window"
  | "door"
  | "art"
  | "pendant"
  | "floorlamp"
  | "counter"
  | "curtain"
  | "plant"
  | "mirror"
  | "desk"
  | "person"
  | "panel"
  | "rail"
  | "crib"
  | "table";

export interface ElevItem {
  id: string;
  kind: ElevKind;
  x: number;
  y: number;
  w: number;
  h: number;
  tone?: MaterialTone;
  state?: ElementTone;
  label?: string;
}

export interface Light {
  id: string;
  layer: "ambient" | "task" | "accent";
  x: number;
  y: number;
  r: number;
  warmth: "warm" | "neutral" | "cool";
  label?: string;
}

export interface ElevationScene {
  kind: "elevation";
  width: number;
  height: number;
  wall: MaterialTone;
  floor: MaterialTone;
  /** 0 = pitch dark, 1 = fully lit. */
  ambient: number;
  daylight: "none" | "soft" | "harsh";
  items: ElevItem[];
  lights: Light[];
  marks: Mark[];
}

export interface CostItem {
  id: string;
  label: string;
  amount: number;
  tone?: "fixed" | "flex" | "cut" | "highlight" | "problem";
  note?: string;
}

export interface BudgetScene {
  kind: "budget";
  cap: number;
  unit: string;
  items: CostItem[];
  marks: Mark[];
}

export type Scene = PlanScene | ElevationScene | BudgetScene;

export type SceneOp =
  | { op: "remove"; id: string }
  | { op: "patch"; id: string; set: Record<string, unknown> }
  | { op: "item"; value: PlanItem }
  | { op: "wall"; value: Wall }
  | { op: "door"; value: Opening }
  | { op: "window"; value: Opening }
  | { op: "flow"; value: Flow }
  | { op: "zone"; value: Zone }
  | { op: "mark"; value: Mark }
  | { op: "elev"; value: ElevItem }
  | { op: "light"; value: Light }
  | { op: "cost"; value: CostItem }
  | { op: "surface"; wall?: MaterialTone; floor?: MaterialTone }
  | { op: "ambient"; value: number; daylight?: ElevationScene["daylight"] }
  | { op: "cap"; value: number };

/* ---------------- Levels ---------------- */

export interface Option {
  id: string;
  label: string;
  detail: string;
  ops: SceneOp[];
  passes: boolean;
  reaction: { mood: Mood; text: string };
  /** Failing options: the concrete problem the client runs into. */
  problem?: string;
  /** Passing options: what was given up and why it is acceptable here. */
  tradeoff?: string;
}

export interface Level {
  id: string;
  chapterId: string;
  title: string;
  brief: string;
  client: CastMember;
  partner?: CastMember;
  constraints: string[];
  base: Scene;
  panels: Panel[];
  question: string;
  options: Option[];
  principleIds: string[];
  /** One-line takeaway shown in review. */
  insight: string;
}

export interface Chapter {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  intro: string;
  tone: 1 | 2 | 3 | 4 | 5;
}

export interface Principle {
  id: string;
  name: string;
  summary: string;
  inSpace: string;
  limits: string;
  group: "感知" | "行为" | "情绪与记忆" | "决策";
}
