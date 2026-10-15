import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpeechBubble } from "@/components/comic/SpeechBubble";
import type { Level } from "@/game/types";
import { cn } from "@/lib/utils";
import { castFor } from "./cast";
import { StageShell } from "./StageShell";

interface StoryStageProps {
  level: Level;
  panel: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

export function StoryStage({ level, panel, onNext, onPrev, onSkip }: StoryStageProps) {
  const { t } = useTranslation();
  const current = level.panels[panel];
  const isLast = panel === level.panels.length - 1;

  return (
    <StageShell
      actions={
        <>
          <Button
            variant="comicLight"
            size="iconTouch"
            onClick={onPrev}
            disabled={panel === 0}
            aria-label={t("play.prev")}
            data-testid="story-prev"
          >
            <ChevronLeft />
          </Button>
          <Button variant="comic" size="xl" className="flex-1" onClick={onNext} data-testid="story-next">
            {isLast ? t("play.toChoice") : t("play.next")}
            <ChevronRight />
          </Button>
          {!isLast && (
            <Button variant="ghostInk" size="iconTouch" onClick={onSkip} aria-label={t("play.skip")} data-testid="story-skip">
              <FastForward />
            </Button>
          )}
        </>
      }
    >
      {panel === 0 && (
        <p className="mb-3 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">{level.brief}</p>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={panel}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
        >
          <SpeechBubble
            who={castFor(level, current.speaker)}
            mood={current.mood}
            text={current.text}
            side={current.speaker === "designer" ? "right" : "left"}
          />
        </motion.div>
      </AnimatePresence>
      <div className="mt-1 flex justify-center gap-1.5" aria-label={`${panel + 1} / ${level.panels.length}`}>
        {level.panels.map((_, i) => (
          <span
            key={i}
            className={cn("h-1.5 rounded-full transition-all", i === panel ? "w-5 bg-ink" : "w-1.5 bg-ink/25")}
          />
        ))}
      </div>
    </StageShell>
  );
}
