import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Lock, MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoughFrame } from "@/components/comic/RoughFrame";
import { Swirl } from "@/components/comic/Doodle";
import { levelById, levelNumber } from "@/game/levels";
import { useGameProgress } from "@/hooks/use-game-progress";
import { LevelPlayer } from "./LevelPlayer";

const Play = () => {
  const { levelId = "" } = useParams();
  const { t } = useTranslation();
  const { isUnlocked, currentLevelId } = useGameProgress();
  const level = levelById.get(levelId);

  if (level && isUnlocked(level.id)) return <LevelPlayer key={level.id} level={level} />;

  const locked = Boolean(level);
  return (
    <div className="pt-safe pb-safe px-safe flex min-h-[100dvh] items-center justify-center">
      <div
        className="tape doodle-card relative w-full max-w-sm border-2 border-ink bg-card p-6 pt-8 text-center shadow-comic-lg"
        data-testid={locked ? "level-locked" : "level-missing"}
      >
        <RoughFrame className="opacity-35" offset={2.5} />
        <Swirl className="absolute -right-3 top-6 h-6 w-9 opacity-70" />
        <span className="sticker mx-auto flex h-14 w-14 -rotate-3 items-center justify-center border-2 border-ink bg-accent">
          {locked ? <Lock className="h-6 w-6" /> : <MapPinOff className="h-6 w-6" />}
        </span>
        <h1 className="mt-4 font-display text-2xl">
          <span className="marker-pink">{locked ? t("play.locked.title") : t("play.notFound.title")}</span>
        </h1>
        {locked && <p className="mt-2 text-sm text-muted-foreground">{t("play.locked.desc")}</p>}
        <div className="mt-5 flex flex-col gap-2.5">
          {locked && currentLevelId && (
            <Button asChild variant="comic" size="xl" data-testid="gate-current">
              <Link to={`/play/${currentLevelId}`}>{t("play.locked.goCurrent", { n: levelNumber(currentLevelId) })}</Link>
            </Button>
          )}
          <Button asChild variant="comicLight" size="xl" data-testid="gate-home">
            <Link to="/">{t("play.back")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Play;
