import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Eye, Lightbulb, Split } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/game/ProgressBar";
import { Character } from "@/components/comic/Character";
import { Sparkle, SunDoodle, Squiggle } from "@/components/comic/Doodle";
import { DESIGNER } from "@/game/designer";
import { levelNumber } from "@/game/levels";
import { PRINCIPLES } from "@/game/principles";
import { useGameProgress } from "@/hooks/use-game-progress";
import { cn } from "@/lib/utils";

const steps = [
  { key: "home.howto.story", icon: BookOpen, tone: "bg-primary-soft", tilt: "tilt-1" },
  { key: "home.howto.choose", icon: Split, tone: "bg-secondary", tilt: "tilt-2" },
  { key: "home.howto.see", icon: Eye, tone: "bg-accent-soft", tilt: "tilt-1" },
  { key: "home.howto.review", icon: Lightbulb, tone: "bg-chapter-4", tilt: "tilt-2" },
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
    <header className="tape doodle-card relative overflow-hidden border-2 border-ink bg-card p-5 pt-6 shadow-comic-lg sm:p-8 sm:pt-9">
      <div className="paper-dots absolute inset-0 opacity-50" aria-hidden />
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <SunDoodle className="absolute right-5 top-5 hidden h-10 w-10 animate-float sm:block" />
      <Squiggle className="absolute bottom-3 right-6 hidden w-24 text-primary-ink/50 lg:block" />

      <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="sticker inline-block -rotate-2 border-2 border-ink bg-accent px-3 py-1 text-xs font-bold">
            {t("home.hero.eyebrow")}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-none tracking-tight sm:text-6xl">
            <span className="doodle-underline">{t("common.appName")}</span>
          </h1>
          <p className="mt-4 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("home.hero.subtitle")}
          </p>

          <ol className="mt-5 flex flex-wrap items-center gap-x-1 gap-y-2 text-sm font-bold">
            {steps.map(({ key, icon: Icon, tone, tilt }, i) => (
              <li key={key} className="flex items-center gap-1">
                <span
                  className={cn(
                    "doodle-pill flex items-center gap-1.5 border-2 border-ink px-2.5 py-1 shadow-[2px_2px_0_0_hsl(var(--ink))]",
                    tone,
                    tilt,
                  )}
                >
                  <Icon className="h-4 w-4 text-primary-ink" />
                  {t(key)}
                </span>
                {i < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
              </li>
            ))}
          </ol>

          <div className="mt-6 max-w-md">
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="font-bold">{t("home.progress.label")}</span>
              <span className="font-sans text-lg font-extrabold tabular-nums">
                {clearedCount}
                <span className="text-sm font-medium text-muted-foreground"> / {total}</span>
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
                <Lightbulb className="text-primary-ink" />
                {t("home.principles")}
                <span className="text-xs font-medium text-muted-foreground">
                  {t("home.principlesCount", { seen: progress.seenPrinciples.length, total: PRINCIPLES.length })}
                </span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative hidden shrink-0 md:block">
          <Sparkle className="absolute -left-4 -top-2 h-7 w-7" />
          <div className="blob h-44 w-44 overflow-hidden border-2 border-ink bg-secondary shadow-comic lg:h-52 lg:w-52">
            <Character look={DESIGNER.look} mood="happy" />
          </div>
        </div>
      </div>
    </header>
  );
}
