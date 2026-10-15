import { motion } from "framer-motion";
import type { CastMember, Mood } from "@/game/types";
import { cn } from "@/lib/utils";
import { Character } from "./Character";

interface SpeechBubbleProps {
  who: CastMember | null;
  mood: Mood;
  text: string;
  side?: "left" | "right";
  tone?: "default" | "narrator" | "problem" | "good";
}

const bubbleTone = {
  default: "bg-card",
  narrator: "bg-accent-soft",
  problem: "bg-destructive-soft",
  good: "bg-success-soft",
} as const;

/** Avatar + speech bubble row. `who = null` renders a narrator caption box. */
export function SpeechBubble({ who, mood, text, side = "left", tone = "default" }: SpeechBubbleProps) {
  if (!who) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("rounded-md border-2 border-ink px-4 py-3 text-[15px] leading-relaxed shadow-comic", bubbleTone.narrator)}
      >
        <span className="mr-2 inline-block rounded-sm bg-ink px-1.5 py-0.5 text-[11px] font-bold text-paper">旁白</span>
        {text}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex items-end gap-2", side === "right" && "flex-row-reverse")}
    >
      <div className="flex w-16 shrink-0 flex-col items-center sm:w-[72px]">
        <div className="aspect-square w-full overflow-hidden rounded-full border-2 border-ink bg-secondary">
          <Character look={who.look} mood={mood} />
        </div>
        <span className="mt-1 max-w-full truncate text-[11px] font-bold leading-tight">{who.name}</span>
        <span className="max-w-full truncate text-[10px] leading-tight text-muted-foreground">{who.role}</span>
      </div>
      <div
        className={cn(
          "relative mb-6 flex-1 rounded-lg border-2 border-ink px-4 py-3 text-[15px] leading-relaxed shadow-comic",
          bubbleTone[tone],
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute bottom-3 h-3 w-3 rotate-45 border-ink",
            bubbleTone[tone],
            side === "left" ? "-left-[7px] border-b-2 border-l-2" : "-right-[7px] border-r-2 border-t-2",
          )}
        />
        {text}
      </div>
    </motion.div>
  );
}
