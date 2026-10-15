import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Eye, Lightbulb, Split } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/game/ProgressBar";
import { Character } from "@/components/comic/Character";
import { DESIGNER } from "@/game/designer";
import { levelNumber } from "@/game/levels";
import { PRINCIPLES } from "@/game/principles";
import { useGameProgress } from "@/hooks/use-game-progress";

const steps = [
  { key: "home.howto.story", icon: BookOpen },
  { key: "home.howto.choose", icon: Split },
  { key: "home.howto.see", icon: Eye },
  { key: "home.howto.review", icon: Lightbulb },
] as const;

export function HeroSection() {
  const { t } = useTranslation();
  const { clearedCount, total, currentLevelId, progress } = useGameProgress();
  const ctaTo = `/play/${currentLevelId ?? "c1-l01"}`;
  const ctaLabel = !currentLevelId
    ? t("home.cta.allDone")
    : clearedCount === 0
      ? t("home.cta.start")
      : t("home.cta.continue", { n: levelNumber(currentLevelId) });

  return (
    <header className="relative overflow-hidden rounded-lg border-2 border-ink bg-card p-5 shadow-comic-lg sm:p-8">
      <div className="paper-dots absolute inset-0 opacity-60" aria-hidden />
      <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="inline-block rounded-full border-2 border-ink bg-accent px-3 py-0.5 text-xs font-bold">
            {t("home.hero.eyebrow")}
          </p>
          <h1 className="mt-3 font-display text-5xl font-black leading-none tracking-tight sm:text-6xl">
            {t("common.appName")}
          </h1>
          <p className="mt-3 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("home.hero.subtitle")}
          </p>

          <ol className="mt-5 flex flex-wrap items-center gap-x-1 gap-y-2 text-sm font-bold">
            {steps.map(({ key, icon: Icon }, i) => (
              <li key={key} className="flex items-center gap-1">
                <span className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-2.5 py-1">
                  <Icon className="h-4 w-4 text-primary" />
                  {t(key)}
                </span>
                {i < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
              </li>
            ))}
          </ol>

          <div className="mt-6 max-w-md">
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="font-bold">{t("home.progress.label")}</span>
              <span className="font-display text-lg font-black tabular-nums">
                {clearedCount}
                <span className="text-sm text-muted-foreground"> / {total}</span>
              </span>
            </div>
            <ProgressBar value={clearedCount} max={total} />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="comic" size="xl" data-testid="home-continue">
              <Link to={ctaTo}>
                {ctaLabel}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="comicLight" size="xl" data-testid="home-principles">
              <Link to="/principles">
                <Lightbulb />
                {t("home.principles")}
                <span className="text-xs font-medium text-muted-foreground">
                  {t("home.principlesCount", { seen: progress.seenPrinciples.length, total: PRINCIPLES.length })}
                </span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="hidden h-44 w-44 shrink-0 overflow-hidden rounded-full border-2 border-ink bg-secondary shadow-comic md:block lg:h-52 lg:w-52">
          <Character look={DESIGNER.look} mood="happy" />
        </div>
      </div>
    </header>
  );
}
