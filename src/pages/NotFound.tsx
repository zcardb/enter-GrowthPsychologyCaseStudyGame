import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RoughFrame } from "@/components/comic/RoughFrame";
import { Sparkle, Squiggle } from "@/components/comic/Doodle";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="pt-safe pb-safe px-safe flex min-h-[100dvh] items-center justify-center">
      <div className="tape doodle-card-alt relative border-2 border-ink bg-card p-8 pt-10 text-center shadow-comic-lg">
        <RoughFrame className="opacity-35" offset={2.5} />
        <Sparkle className="absolute -left-3 bottom-6 h-6 w-6" />
        <Squiggle className="absolute -right-4 top-8 w-14 text-primary-ink/40" />
        <h1 className="doodle-underline font-marker text-7xl font-bold leading-none">404</h1>
        <p className="mb-5 mt-4 text-lg text-muted-foreground">{t("notFound.title")}</p>
        <Button asChild variant="comic" size="xl">
          <Link to="/">{t("notFound.actions.backHome")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
