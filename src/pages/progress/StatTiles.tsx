import { useTranslation } from "react-i18next";
import { Flag, Lightbulb, Repeat2, Zap, type LucideIcon } from "lucide-react";
import type { ProgressSummary } from "@/game/progress-summary";
import { cn } from "@/lib/utils";

interface StatTile {
  id: "cleared" | "firstTry" | "attempts" | "principles";
  icon: LucideIcon;
  value: number;
  suffix?: string;
  tone: string;
  tilt: string;
}

export function StatTiles({ summary }: { summary: ProgressSummary }) {
  const { t } = useTranslation();

  const tiles: StatTile[] = [
    {
      id: "cleared",
      icon: Flag,
      value: summary.clearedCount,
      suffix: `/ ${summary.total}`,
      tone: "bg-primary-soft",
      tilt: "tilt-1",
    },
    {
      id: "firstTry",
      icon: Zap,
      value: summary.firstTryCount,
      suffix: summary.clearedCount > 0 ? `/ ${summary.clearedCount}` : undefined,
      tone: "bg-accent-soft",
      tilt: "tilt-2",
    },
    {
      id: "attempts",
      icon: Repeat2,
      value: summary.totalAttempts,
      tone: "bg-secondary",
      tilt: "tilt-l",
    },
    {
      id: "principles",
      icon: Lightbulb,
      value: summary.seenCount,
      suffix: `/ ${summary.principleTotal}`,
      tone: "bg-chapter-4",
      tilt: "tilt-1",
    },
  ];

  return (
    <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
      {tiles.map(({ id, icon: Icon, value, suffix, tone, tilt }) => (
        <div
          key={id}
          className={cn(
            "doodle-card flex items-center gap-2.5 border-2 border-ink p-2.5 shadow-[3px_3px_0_0_hsl(var(--ink)/0.14)] sm:p-3",
            tone,
            tilt,
          )}
          data-testid={`progress-stat-${id}`}
        >
          <span className="sticker flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink bg-card">
            <Icon className="h-4 w-4 text-primary-ink" />
          </span>
          <div className="min-w-0">
            <p className="font-sans text-xl font-extrabold leading-none tabular-nums">
              {value}
              {suffix && <span className="text-xs font-medium text-muted-foreground"> {suffix}</span>}
            </p>
            <p className="mt-1 truncate text-[11px] font-bold text-muted-foreground">{t(`progress.stats.${id}`)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
