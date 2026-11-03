import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/game/ProgressBar";
import { Squiggle, StarDoodle } from "@/components/comic/Doodle";
import { evaluateAchievements } from "@/game/achievements";
import { LEVELS, levelNumber } from "@/game/levels";
import { summarizeProgress } from "@/game/progress-summary";
import { useGameProgress } from "@/hooks/use-game-progress";
import { AchievementCard } from "./AchievementCard";
import { ChapterReport } from "./ChapterReport";
import { StatTiles } from "./StatTiles";

const Progress = () => {
  const { t } = useTranslation();
  const { progress } = useGameProgress();
  const summary = useMemo(() => summarizeProgress(progress), [progress]);
  const achievements = useMemo(() => evaluateAchievements(progress), [progress]);
  const unlockedCount = achievements.filter((state) => state.unlocked).length;
  const review = summary.reviewLevels.slice(0, 5);
  const firstLevelId = LEVELS[0]?.id ?? "c1-l01";

  return (
    <div className="pt-safe pb-safe px-safe min-h-[100dvh]">
      <main className="mx-auto max-w-5xl py-2 sm:py-6">
        <header className="flex items-start gap-3">
          <Button asChild variant="comicLight" size="iconTouch" className="shrink-0" data-testid="progress-back">
            <Link to="/" aria-label={t("progress.back")}>
              <ArrowLeft />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl leading-tight sm:text-4xl">
              <span className="doodle-underline">{t("progress.title")}</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{t("progress.subtitle")}</p>
          </div>
        </header>

        <section className="tape doodle-card relative mt-5 border-2 border-ink bg-card p-4 shadow-comic sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-lg">{t("progress.overall")}</h2>
            <p className="font-sans text-2xl font-extrabold leading-none tabular-nums">
              {summary.clearedCount}
              <span className="text-sm font-medium text-muted-foreground"> / {summary.total}</span>
            </p>
          </div>
          <ProgressBar value={summary.clearedCount} max={summary.total} className="mt-2 h-3.5" />
          <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <StarDoodle className="h-4 w-4 text-primary-ink" />
            {t("progress.badges", { n: unlockedCount, total: achievements.length })}
          </p>
        </section>

        <StatTiles summary={summary} />

        {summary.clearedCount === 0 && (
          <section className="doodle-card-alt mt-4 border-2 border-dashed border-ink/30 bg-accent-soft/40 p-4 text-center">
            <p className="font-display text-lg">{t("progress.empty.title")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("progress.empty.desc")}</p>
            <Button asChild variant="comic" size="xl" className="mt-3" data-testid="progress-empty-cta">
              <Link to={`/play/${firstLevelId}`}>
                {t("progress.empty.cta")}
                <ArrowRight />
              </Link>
            </Button>
          </section>
        )}

        <section className="mt-7">
          <h2 className="doodle-pill inline-block border-2 border-ink bg-primary-soft px-3 py-1 text-sm font-bold text-ink">
            {t("progress.chapters")}
          </h2>
          <ChapterReport chapters={summary.chapters} />
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="doodle-pill inline-block border-2 border-ink bg-accent-soft px-3 py-1 text-sm font-bold text-ink">
              {t("progress.badgesSection")}
            </h2>
            <p className="font-sans text-xs font-extrabold tabular-nums text-muted-foreground">
              {unlockedCount} / {achievements.length}
            </p>
          </div>
          <Squiggle className="mb-3 mt-2 h-2.5 w-28 text-primary-ink/40" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {achievements.map((state) => (
              <AchievementCard key={state.achievement.id} state={state} />
            ))}
          </div>
        </section>

        {review.length > 0 && (
          <section className="mt-8" data-testid="progress-review">
            <h2 className="doodle-pill inline-block border-2 border-ink bg-secondary px-3 py-1 text-sm font-bold text-secondary-foreground">
              {t("progress.review.title")}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">{t("progress.review.desc")}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {review.map(({ level, attempts, mistakeCount, cleared }) => (
                <li key={level.id}>
                  <Link
                    to={`/play/${level.id}`}
                    data-testid={`progress-review-${level.id}`}
                    className="doodle-card wobble-hover flex items-center gap-3 border-2 border-ink bg-card p-2.5 shadow-[3px_3px_0_0_hsl(var(--ink)/0.12)]"
                  >
                    <span className="sticker flex h-8 w-8 shrink-0 -rotate-3 items-center justify-center border-2 border-ink bg-primary-soft font-sans text-sm font-extrabold text-ink">
                      {levelNumber(level.id)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold leading-tight">{level.title}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                        <span>{t("progress.review.attempts", { n: attempts })}</span>
                        {mistakeCount > 0 && <span>{t("progress.review.mistakes", { n: mistakeCount })}</span>}
                        {cleared && <span className="font-bold text-success">{t("progress.review.cleared")}</span>}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

export default Progress;
