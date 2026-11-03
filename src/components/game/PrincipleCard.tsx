import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { RoughFrame } from "@/components/comic/RoughFrame";
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
    <article
      className={cn(
        "tape tape-sm doodle-card relative border-2 border-ink bg-card p-4 pt-5 shadow-comic wobble-hover",
        className,
      )}
    >
      <RoughFrame className="opacity-45" offset={2.5} />
      <div className="relative flex items-start justify-between gap-2">
        <h3 className="font-display text-lg leading-tight">
          <span className="mr-1.5 inline-block h-2 w-2 -rotate-12 rounded-[2px] border border-ink bg-accent align-middle" aria-hidden />
          {principle.name}
        </h3>
        <Badge variant="accent" className="shrink-0">
          {principle.group}
        </Badge>
      </div>
      <p className="relative mt-2 text-[15px] font-medium leading-relaxed">{principle.summary}</p>
      <dl className="relative mt-3 space-y-2 text-sm leading-relaxed">
        <div>
          <dt className="text-xs font-bold text-primary-ink">{t("principles.inSpace")}</dt>
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
