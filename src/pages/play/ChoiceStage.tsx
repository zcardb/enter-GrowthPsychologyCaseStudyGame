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
      <div className="tape tape-mint tape-sm note-lined doodle-card relative mb-3 border-2 border-ink bg-secondary/70 p-3 pl-3.5 pt-4">
        <p className="flex items-center gap-1.5 text-xs font-bold">
          <ClipboardList className="h-3.5 w-3.5" />
          {t("play.review.constraints")}
        </p>
        <ul className="mt-1.5 space-y-0.5 text-sm leading-snug">
          {level.constraints.map((c) => (
            <li key={c} className="flex gap-1.5">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 rounded-[1px] bg-ink" />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <h2 className="font-display text-xl leading-snug">
        <span className="marker">{level.question}</span>
      </h2>
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
                "doodle-card group flex w-full items-start gap-3 border-2 border-ink bg-card p-3 text-left shadow-comic transition-all wobble-hover",
                "hover:bg-primary-soft hover:shadow-comic-lg active:shadow-none",
                i % 2 === 0 ? "tilt-1" : "tilt-2",
                wasTried && "bg-muted/70 opacity-75",
              )}
            >
              <span
                className={cn(
                  "sticker flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink font-marker text-lg font-bold",
                  i === 0 ? "-rotate-6 bg-accent" : i === 1 ? "rotate-3 bg-primary-soft" : "-rotate-2 bg-secondary",
                )}
              >
                {LETTERS[i]}
              </span>
              <span className={cn("min-w-0 flex-1", wasTried && "opacity-80")}>
                <span className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "text-[15px] font-bold leading-snug",
                      wasTried && "line-through decoration-destructive/70 decoration-2",
                    )}
                  >
                    {opt.label}
                  </span>
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
        className="mt-3 min-h-[44px] w-full text-center text-sm font-medium text-muted-foreground underline decoration-primary decoration-wavy underline-offset-4 hover:text-foreground"
        data-testid="choice-reread"
      >
        {t("play.reread")}
      </button>
    </StageShell>
  );
}
