import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="pt-safe pb-safe px-safe flex min-h-[100dvh] items-center justify-center">
      <div className="rounded-lg border-2 border-ink bg-card p-8 text-center shadow-comic-lg">
        <h1 className="font-display text-6xl font-black">404</h1>
        <p className="mb-5 mt-2 text-lg text-muted-foreground">{t("notFound.title")}</p>
        <Button asChild variant="comic" size="xl">
          <Link to="/">{t("notFound.actions.backHome")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
