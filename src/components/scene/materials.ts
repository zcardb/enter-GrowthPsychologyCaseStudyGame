import type { MaterialTone } from "@/game/types";

/** Literal class maps so Tailwind can see every material class. */
export const matFill: Record<MaterialTone, string> = {
  paper: "fill-mat-paper",
  white: "fill-mat-white",
  oak: "fill-mat-oak",
  walnut: "fill-mat-walnut",
  concrete: "fill-mat-concrete",
  terrazzo: "fill-mat-terrazzo",
  sage: "fill-mat-sage",
  terracotta: "fill-mat-terracotta",
  navy: "fill-mat-navy",
  mustard: "fill-mat-mustard",
  linen: "fill-mat-linen",
  stone: "fill-mat-stone",
  tile: "fill-mat-tile",
  pink: "fill-mat-pink",
  charcoal: "fill-mat-charcoal",
  mirror: "fill-mat-mirror",
};

export const matBg: Record<MaterialTone, string> = {
  paper: "bg-mat-paper",
  white: "bg-mat-white",
  oak: "bg-mat-oak",
  walnut: "bg-mat-walnut",
  concrete: "bg-mat-concrete",
  terrazzo: "bg-mat-terrazzo",
  sage: "bg-mat-sage",
  terracotta: "bg-mat-terracotta",
  navy: "bg-mat-navy",
  mustard: "bg-mat-mustard",
  linen: "bg-mat-linen",
  stone: "bg-mat-stone",
  tile: "bg-mat-tile",
  pink: "bg-mat-pink",
  charcoal: "bg-mat-charcoal",
  mirror: "bg-mat-mirror",
};

/** Dark materials need light label text. */
export const isDarkMat = (t: MaterialTone) => t === "walnut" || t === "navy" || t === "charcoal";
