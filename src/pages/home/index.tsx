import { useTranslation } from "react-i18next";
import { RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CHAPTERS } from "@/game/chapters";
import { useGameProgress } from "@/hooks/use-game-progress";
import { ChapterSection } from "./ChapterSection";
import { HeroSection } from "./HeroSection";

const Home = () => {
  const { t } = useTranslation();
  const { resetAll, clearedCount } = useGameProgress();

  return (
    <div className="pt-safe pb-safe px-safe min-h-[100dvh]">
      <main className="mx-auto flex max-w-5xl flex-col gap-5 py-2 sm:gap-6 sm:py-6">
        <HeroSection />
        {CHAPTERS.map((chapter) => (
          <ChapterSection key={chapter.id} chapter={chapter} />
        ))}

        <footer className="flex flex-wrap items-center justify-between gap-3 pb-4 text-xs text-muted-foreground">
          <span>
            {t("common.appName")} · {t("common.tagline")}
          </span>
          {clearedCount > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghostInk" size="sm" data-testid="home-reset">
                  <RotateCcw />
                  {t("home.reset")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-2 border-ink shadow-comic-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("home.resetConfirm")}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={resetAll} data-testid="home-reset-confirm">
                    {t("home.reset")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </footer>
      </main>
    </div>
  );
};

export default Home;
