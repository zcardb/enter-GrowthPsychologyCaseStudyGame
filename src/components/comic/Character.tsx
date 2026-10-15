import type { CharacterLook, Mood, OutfitTone } from "@/game/types";
import { cn } from "@/lib/utils";

const outfitFill: Record<OutfitTone, string> = {
  terracotta: "fill-chapter-1",
  sage: "fill-chapter-2",
  mustard: "fill-accent",
  slate: "fill-chapter-4",
  berry: "fill-chapter-5",
  ink: "fill-ink",
  linen: "fill-mat-linen",
};
const skinFill = { 1: "fill-skin-1", 2: "fill-skin-2", 3: "fill-skin-3" } as const;
const hairFill = { 1: "fill-hair-1", 2: "fill-hair-2", 3: "fill-hair-3", 4: "fill-hair-4" } as const;

interface CharacterProps {
  look: CharacterLook;
  mood: Mood;
  className?: string;
}

/** Original parametric comic bust. viewBox 0..100. */
export function Character({ look, mood, className }: CharacterProps) {
  const kid = look.age === "kid";
  const elder = look.age === "elder";
  const headR = kid ? 24 : 21;
  const cx = 50;
  const cy = kid ? 44 : 40;
  const hair = hairFill[elder ? 3 : look.hairTone];
  const s = "stroke-ink";

  const hairBack = () => {
    switch (look.hair) {
      case "long":
        return <path d={`M${cx - headR - 3} ${cy}Q${cx - headR - 6} ${cy + 34} ${cx - 14} ${cy + 36}H${cx + 14}Q${cx + headR + 6} ${cy + 34} ${cx + headR + 3} ${cy}Z`} className={cn(hair, s)} strokeWidth={2} />;
      case "bob":
        return <path d={`M${cx - headR - 3} ${cy - 2}V${cy + 18}H${cx + headR + 3}V${cy - 2}Z`} className={cn(hair, s)} strokeWidth={2} />;
      case "ponytail":
        return <ellipse cx={cx + headR + 4} cy={cy + 6} rx={6} ry={14} className={cn(hair, s)} strokeWidth={2} />;
      case "bun":
        return <circle cx={cx} cy={cy - headR - 4} r={9} className={cn(hair, s)} strokeWidth={2} />;
      default:
        return null;
    }
  };

  const hairFront = () => {
    if (look.hair === "bald") return elder ? <path d={`M${cx - headR + 1} ${cy - 4}Q${cx - headR} ${cy - 12} ${cx - headR + 8} ${cy - 14}M${cx + headR - 1} ${cy - 4}Q${cx + headR} ${cy - 12} ${cx + headR - 8} ${cy - 14}`} className={cn("fill-none", "stroke-hair-3")} strokeWidth={4} strokeLinecap="round" /> : null;
    if (look.hair === "curly")
      return (
        <g className={cn(hair, s)} strokeWidth={1.6}>
          {[-16, -6, 4, 14].map((dx) => (
            <circle key={dx} cx={cx + dx} cy={cy - headR + 4} r={8} />
          ))}
          <circle cx={cx - headR + 2} cy={cy - 6} r={6} />
          <circle cx={cx + headR - 2} cy={cy - 6} r={6} />
        </g>
      );
    return (
      <path
        d={`M${cx - headR - 1} ${cy - 2}Q${cx - headR} ${cy - headR - 6} ${cx} ${cy - headR - 3}Q${cx + headR} ${cy - headR - 6} ${cx + headR + 1} ${cy - 2}Q${cx + 6} ${cy - headR + 4} ${cx - headR - 1} ${cy - 2}Z`}
        className={cn(hair, s)}
        strokeWidth={2}
      />
    );
  };

  const eyeY = cy + 2;
  const eyes = () => {
    if (mood === "happy")
      return (
        <path d={`M${cx - 11} ${eyeY + 1}q4 -5 8 0M${cx + 3} ${eyeY + 1}q4 -5 8 0`} className="fill-none stroke-ink" strokeWidth={2.2} strokeLinecap="round" />
      );
    const r = mood === "surprised" ? 3.2 : 2.4;
    return (
      <>
        <circle cx={cx - 7} cy={eyeY} r={r} className="fill-ink" />
        <circle cx={cx + 7} cy={eyeY} r={r} className="fill-ink" />
      </>
    );
  };

  const brows = () => {
    const y = eyeY - 8;
    const d =
      mood === "worried"
        ? `M${cx - 12} ${y + 1}L${cx - 4} ${y - 2}M${cx + 4} ${y - 2}L${cx + 12} ${y + 1}`
        : mood === "annoyed"
          ? `M${cx - 12} ${y - 2}L${cx - 4} ${y + 2}M${cx + 4} ${y + 2}L${cx + 12} ${y - 2}`
          : mood === "surprised"
            ? `M${cx - 12} ${y - 3}q4 -3 8 0M${cx + 4} ${y - 3}q4 -3 8 0`
            : `M${cx - 11} ${y}H${cx - 4}M${cx + 4} ${y}H${cx + 11}`;
    return <path d={d} className="fill-none stroke-ink" strokeWidth={2} strokeLinecap="round" />;
  };

  const mouth = () => {
    const y = cy + 12;
    switch (mood) {
      case "happy":
        return <path d={`M${cx - 7} ${y - 1}Q${cx} ${y + 7} ${cx + 7} ${y - 1}Z`} className="fill-card stroke-ink" strokeWidth={2} strokeLinejoin="round" />;
      case "worried":
        return <path d={`M${cx - 6} ${y + 2}q3 -3 6 0t6 0`} className="fill-none stroke-ink" strokeWidth={2} strokeLinecap="round" />;
      case "annoyed":
        return <path d={`M${cx - 6} ${y + 2}Q${cx} ${y - 3} ${cx + 6} ${y + 2}`} className="fill-none stroke-ink" strokeWidth={2} strokeLinecap="round" />;
      case "surprised":
        return <ellipse cx={cx} cy={y + 1} rx={3.5} ry={4.5} className="fill-ink" />;
      default:
        return <path d={`M${cx - 5} ${y}H${cx + 5}`} className="stroke-ink" strokeWidth={2} strokeLinecap="round" />;
    }
  };

  return (
    <svg viewBox="0 0 100 100" className={cn("h-full w-full", className)} aria-hidden="true">
      {/* Shoulders */}
      <path d={`M${kid ? 22 : 14} 100Q${kid ? 24 : 16} ${cy + headR + 10} 50 ${cy + headR + 8}Q${kid ? 76 : 84} ${cy + headR + 10} ${kid ? 78 : 86} 100Z`} className={cn(outfitFill[look.outfit], s)} strokeWidth={2.4} />
      <path d={`M44 ${cy + headR + 8}L50 ${cy + headR + 16}L56 ${cy + headR + 8}`} className="fill-none stroke-ink" strokeWidth={1.8} />
      {hairBack()}
      <rect x={cx - 6} y={cy + headR - 6} width={12} height={10} className={cn(skinFill[look.skin], s)} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={headR} className={cn(skinFill[look.skin], s)} strokeWidth={2.4} />
      {hairFront()}
      {brows()}
      {eyes()}
      {mood === "happy" && (
        <>
          <circle cx={cx - 13} cy={cy + 9} r={3} className="fill-primary/30" />
          <circle cx={cx + 13} cy={cy + 9} r={3} className="fill-primary/30" />
        </>
      )}
      {mouth()}
      {elder && <path d={`M${cx - 15} ${eyeY + 5}l3 2M${cx + 15} ${eyeY + 5}l-3 2`} className="stroke-ink/50" strokeWidth={1.2} />}
      {look.accessory === "glasses" && (
        <g className="fill-none stroke-ink" strokeWidth={1.8}>
          <circle cx={cx - 7} cy={eyeY} r={6} />
          <circle cx={cx + 7} cy={eyeY} r={6} />
          <path d={`M${cx - 1} ${eyeY}H${cx + 1}`} />
        </g>
      )}
      {look.accessory === "beard" && (
        <path d={`M${cx - headR + 4} ${cy + 6}Q${cx} ${cy + headR + 10} ${cx + headR - 4} ${cy + 6}Q${cx} ${cy + 14} ${cx - headR + 4} ${cy + 6}Z`} className={cn(hair, s)} strokeWidth={1.6} />
      )}
      {look.accessory === "cap" && (
        <path d={`M${cx - headR - 1} ${cy - 6}Q${cx} ${cy - headR - 14} ${cx + headR + 1} ${cy - 6}H${cx + headR + 12}Z`} className={cn("fill-chapter-4", s)} strokeWidth={2} />
      )}
      {look.accessory === "earring" && <circle cx={cx - headR + 1} cy={cy + 8} r={2.4} className="fill-accent stroke-ink" strokeWidth={1} />}
    </svg>
  );
}
