import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AlertTriangle, ArrowRight, CheckCircle2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpeechBubble } from "@/components/comic/SpeechBubble";
import type { Level, Option } from "@/game/types";
import { cn } from "@/lib/utils";
import { StageShell } from "./StageShell";

interface OutcomeStageProps {
  level: Level;
  option: Option;
  onRetry: () => void;
  onReview: () => void;
}

export function OutcomeStage({ level, option, onRetry, onReview }: OutcomeStageProps) {
  const { t } = useTranslation();
  const pass = option.passes;

  return (
    <StageShell
      actions={
        pass ? (
          <Button variant="comicSuccess" size="xl" className="flex-1" onClick={onReview} data-testid="outcome-review">
            {t("play.toReview")}
            <ArrowRight />
          </Button>
        ) : (
          <Button variant="comic" size="xl" className="flex-1" onClick={onRetry} data-testid="outcome-retry">
            <Undo2 />
            {t("play.retry")}
          </Button>
        )
      }
    >
      <p className="mb-2 text-xs font-bold text-muted-foreground">
        {t("play.yourPlan")}<span className="text-foreground">{option.label}</span>
      </p>

      <SpeechBubble who={level.client} mood={option.reaction.mood} text={option.reaction.text} tone={pass ? "good" : "problem"} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={cn(
          "rounded-lg border-2 border-ink p-3.5 shadow-comic",
          pass ? "bg-success-soft" : "animate-shake bg-destructive-soft motion-reduce:animate-none",
        )}
      >
        <p className={cn("flex items-center gap-1.5 font-display text-base font-black", pass ? "text-success" : "text-destructive")}>
          {pass ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          {pass ? t("play.outcome.pass") : t("play.outcome.fail")}
        </p>
        <p className="mt-1.5 text-[15px] leading-relaxed">{pass ? option.tradeoff : option.problem}</p>
      </motion.div>
    </StageShell>
  );
}
