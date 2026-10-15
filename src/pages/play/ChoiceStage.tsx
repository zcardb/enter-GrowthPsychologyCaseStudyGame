import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ClipboardList, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Level } from "@/game/types";
import { cn } from "@/lib/utils";
import { StageShell } from "./StageShell";

interface ChoiceStageProps {
  level: Level;
  tried: string[];
  onChoose: (optionId: string) => void;
  onBack: () => void;
}

const LETTERS = ["A", "B", "C"];

export function ChoiceStage({ level, tried, onChoose, onBack }: ChoiceStageProps) {
  const { t } = useTranslation();

  return (
    <StageShell>
      <div className="mb-3 rounded-md border-2 border-ink bg-accent-soft p-3">
        <p className="flex items-center gap-1.5 text-xs font-bold">
          <ClipboardList className="h-3.5 w-3.5" />
          {t("play.review.constraints")}
        </p>
        <ul className="mt-1.5 space-y-0.5 text-sm leading-snug">
          {level.constraints.map((c) => (
            <li key={c} className="flex gap-1.5">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <h2 className="font-display text-xl font-black leading-snug">{level.question}</h2>
      <p className="mb-3 text-xs text-muted-foreground">{t("play.question")}</p>

      <div className="flex flex-col gap-2.5">
        {level.options.map((opt, i) => {
          const wasTried = tried.includes(opt.id) && !opt.passes;
          return (
            <motion.button
              key={opt.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onChoose(opt.id)}
              data-testid={`option-${opt.id}`}
              className={cn(
                "group flex w-full items-start gap-3 rounded-lg border-2 border-ink bg-card p-3 text-left shadow-comic transition-all",
                "hover:-translate-y-0.5 hover:bg-primary-soft hover:shadow-comic-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                wasTried && "bg-muted/70 opacity-75",
              )}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-accent font-display text-base font-black">
                {LETTERS[i]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[15px] font-bold leading-snug">{opt.label}</span>
                  {wasTried && (
                    <Badge variant="danger" className="gap-0.5 px-1.5 py-0 text-[10px]">
                      <X className="h-3 w-3" />
                      {t("play.tried")}
                    </Badge>
                  )}
                </span>
                <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{opt.detail}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-3 min-h-[44px] w-full text-center text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
        data-testid="choice-reread"
      >
        {t("play.reread")}
      </button>
    </StageShell>
  );
}
