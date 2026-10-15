import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Home, Info, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrincipleCard } from "@/components/game/PrincipleCard";
import { chapterById } from "@/game/chapters";
import { levelNumber, nextLevelId, levelById } from "@/game/levels";
import { principleById } from "@/game/principles";
import type { Level, Option } from "@/game/types";
import { useGameProgress } from "@/hooks/use-game-progress";
import { StageShell } from "./StageShell";

interface ReviewStageProps {
  level: Level;
  option: Option;
  attempts: number;
  onReplay: () => void;
}

export function ReviewStage({ level, option, attempts, onReplay }: ReviewStageProps) {
  const { t } = useTranslation();
  const { completeLevel } = useGameProgress();
  const nextId = nextLevelId(level.id);
  const next = nextId ? levelById.get(nextId) : undefined;
  const chapterDone = !next || next.chapterId !== level.chapterId;
  const chapter = chapterById.get(level.chapterId);

  useEffect(() => {
    completeLevel(level.id, level.principleIds);
  }, [completeLevel, level.id, level.principleIds]);

  return (
    <StageShell
      actions={
        <>
          <Button asChild variant="comicLight" size="iconTouch" data-testid="review-home">
            <Link to="/" aria-label={t("play.review.home")}>
              <Home />
            </Link>
          </Button>
          <Button variant="comicLight" size="iconTouch" onClick={onReplay} aria-label={t("play.review.replay")} data-testid="review-replay">
            <RotateCcw />
          </Button>
          {next ? (
            <Button asChild variant="comic" size="xl" className="flex-1" data-testid="review-next">
              <Link to={`/play/${next.id}`}>
                {t("play.review.next")} · {levelNumber(next.id)}
                <ArrowRight />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="comicSuccess" size="xl" className="flex-1" data-testid="review-finish">
              <Link to="/">{t("play.review.home")}</Link>
            </Button>
          )}
        </>
      }
    >
      {chapterDone && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-3 flex items-center gap-2 rounded-lg border-2 border-ink bg-accent px-3 py-2 font-display text-base font-black shadow-comic"
          data-testid={next ? "review-chapter-done" : "review-all-done"}
        >
          <Sparkles className="h-5 w-5" />
          {next ? t("play.review.chapterDone", { n: chapter?.index }) : t("play.review.allDone")}
        </motion.div>
      )}

      <p className="text-xs font-bold text-muted-foreground">
        {t("play.review.title")} · {t("play.review.attempts", { n: attempts })}
      </p>
      <h2 className="mt-1 font-display text-xl font-black leading-snug">{level.insight}</h2>

      <section className="mt-4">
        <h3 className="text-xs font-bold text-muted-foreground">{t("play.review.constraints")}</h3>
        <ul className="mt-1.5 space-y-1 text-sm">
          {level.constraints.map((c) => (
            <li key={c} className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={3} />
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-md border-2 border-dashed border-ink/40 p-3">
        <h3 className="text-xs font-bold text-muted-foreground">{t("play.review.tradeoff")}</h3>
        <p className="mt-1 text-sm font-bold">{option.label}</p>
        <p className="mt-0.5 text-sm leading-relaxed">{option.tradeoff}</p>
      </section>

      <section className="mt-4">
        <h3 className="mb-2 text-xs font-bold text-muted-foreground">{t("play.review.principles")}</h3>
        <div className="flex flex-col gap-3">
          {level.principleIds.map((id) => {
            const pr = principleById.get(id);
            return pr ? <PrincipleCard key={id} principle={pr} /> : null;
          })}
        </div>
        <p className="mt-3 flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {t("play.review.caveat")}
        </p>
      </section>
    </StageShell>
  );
}
