import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import type { Principle } from "@/game/types";
import { cn } from "@/lib/utils";

interface PrincipleCardProps {
  principle: Principle;
  className?: string;
  footer?: React.ReactNode;
}

/** Principle explainer card: what it is, how it shows up in space, where it stops applying. */
export function PrincipleCard({ principle, className, footer }: PrincipleCardProps) {
  const { t } = useTranslation();
  return (
    <article className={cn("rounded-lg border-2 border-ink bg-card p-4 shadow-comic", className)}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-black leading-tight">{principle.name}</h3>
        <Badge variant="ink" className="shrink-0">
          {principle.group}
        </Badge>
      </div>
      <p className="mt-1.5 text-[15px] font-medium leading-relaxed">{principle.summary}</p>
      <dl className="mt-3 space-y-2 text-sm leading-relaxed">
        <div>
          <dt className="text-xs font-bold text-primary">{t("principles.inSpace")}</dt>
          <dd>{principle.inSpace}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold text-muted-foreground">{t("principles.limits")}</dt>
          <dd className="text-muted-foreground">{principle.limits}</dd>
        </div>
      </dl>
      {footer}
    </article>
  );
}
