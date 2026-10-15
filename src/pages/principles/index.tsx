import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrincipleCard } from "@/components/game/PrincipleCard";
import { levelNumber, levelsUsingPrinciple } from "@/game/levels";
import { PRINCIPLES } from "@/game/principles";
import type { Principle } from "@/game/types";
import { useGameProgress } from "@/hooks/use-game-progress";

const GROUPS: Principle["group"][] = ["感知", "行为", "情绪与记忆", "决策"];

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
            <h1 className="font-display text-3xl font-black leading-tight sm:text-4xl">{t("principles.title")}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("principles.subtitle")}</p>
            <p className="mt-2 text-sm font-bold">
              {t("home.principlesCount", { seen: seen.size, total: PRINCIPLES.length })}
            </p>
          </div>
        </header>

        {GROUPS.map((group) => (
          <section key={group} className="mt-8">
            <h2 className="mb-3 inline-block rounded-full border-2 border-ink bg-accent px-3 py-0.5 text-sm font-bold">{group}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {PRINCIPLES.filter((p) => p.group === group).map((p) =>
                seen.has(p.id) ? (
                  <PrincipleCard
                    key={p.id}
                    principle={p}
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
                                className="inline-flex min-h-[32px] items-center rounded-full border-2 border-ink bg-paper px-2.5 text-xs font-bold hover:bg-primary-soft"
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
                    className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink/30 bg-muted/50 p-4 text-center text-muted-foreground"
                  >
                    <Lock className="h-5 w-5" />
                    <p className="font-display text-lg font-black blur-[3px]" aria-hidden>
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
