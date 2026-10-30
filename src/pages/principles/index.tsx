import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrincipleCard } from "@/components/game/PrincipleCard";
import { Squiggle, StarDoodle } from "@/components/comic/Doodle";
import { levelNumber, levelsUsingPrinciple } from "@/game/levels";
import { PRINCIPLES } from "@/game/principles";
import type { Principle } from "@/game/types";
import { useGameProgress } from "@/hooks/use-game-progress";

const GROUPS: Principle["group"][] = ["感知", "行为", "情绪与记忆", "决策"];

const groupTone: Record<Principle["group"], string> = {
  感知: "bg-primary-soft",
  行为: "bg-secondary",
  情绪与记忆: "bg-chapter-4",
  决策: "bg-accent",
};

const Principles = () => {
  const { t } = useTranslation();
  const { progress, cleared } = useGameProgress();
  const seen = new Set(progress.seenPrinciples);

  return (
    <div className="pt-safe pb-safe px-safe min-h-[100dvh]">
      <main className="mx-auto max-w-5xl py-2 sm:py-6">
        <header className="flex items-start gap-3">
          <Button asChild variant="comicLight" size="iconTouch" className="shrink-0" data-testid="principles-back">
            <Link to="/" aria-label={t("play.back")}>
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-3xl leading-tight sm:text-4xl">
              <span className="doodle-underline">{t("principles.title")}</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{t("principles.subtitle")}</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-bold">
              <StarDoodle className="h-4 w-4" />
              {t("home.principlesCount", { seen: seen.size, total: PRINCIPLES.length })}
            </p>
          </div>
        </header>

        {GROUPS.map((group) => (
          <section key={group} className="mt-8">
            <h2
              className={`sticker mb-3 inline-block -rotate-1 border-2 border-ink px-3 py-1 text-sm font-bold ${groupTone[group]}`}
            >
              {group}
            </h2>
            <Squiggle className="mb-3 h-2.5 w-28 text-primary-ink/40" />
            <div className="grid gap-4 sm:grid-cols-2">
              {PRINCIPLES.filter((p) => p.group === group).map((p) =>
                seen.has(p.id) ? (
                  <PrincipleCard
                    key={p.id}
                    principle={p}
                    className={p.id.length % 2 === 0 ? "tilt-1" : "tilt-2"}
                    footer={
                      <div className="mt-3 border-t-2 border-dashed border-ink/20 pt-2">
                        <p className="text-xs font-bold text-muted-foreground">{t("principles.levels")}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {levelsUsingPrinciple(p.id)
                            .filter((l) => cleared.has(l.id))
                            .map((l) => (
                              <Link
                                key={l.id}
                                to={`/play/${l.id}`}
                                className="doodle-pill inline-flex min-h-[32px] items-center border-2 border-ink bg-paper px-2.5 text-xs font-bold hover:bg-primary-soft"
                              >
                                {levelNumber(l.id)} · {l.title}
                              </Link>
                            ))}
                        </div>
                      </div>
                    }
                  />
                ) : (
                  <div
                    key={p.id}
                    className="lock-hatch doodle-card-alt flex min-h-[120px] flex-col items-center justify-center gap-2 border-2 border-dashed border-ink/30 bg-card/50 p-4 text-center text-muted-foreground"
                  >
                    <span className="sticker flex h-9 w-9 rotate-3 items-center justify-center border-2 border-ink/40 bg-card">
                      <Lock className="h-4 w-4" />
                    </span>
                    <p className="font-display text-lg blur-[3px]" aria-hidden>
                      {p.name}
                    </p>
                    <p className="text-xs">{t("principles.locked")}</p>
                  </div>
                ),
              )}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default Principles;
