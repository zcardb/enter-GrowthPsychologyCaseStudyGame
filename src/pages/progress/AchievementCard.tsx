import { useTranslation } from "react-i18next";
import {
  BookOpenCheck,
  Boxes,
  Compass,
  Eye,
  Flag,
  Layers,
  Lightbulb,
  Lock,
  Sun,
  Trophy,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { AchievementIcon, AchievementState, AchievementTone } from "@/game/achievements";
import { cn } from "@/lib/utils";

const ICONS: Record<AchievementIcon, LucideIcon> = {
  flag: Flag,
  compass: Compass,
  boxes: Boxes,
  sun: Sun,
  layers: Layers,
  wallet: Wallet,
  zap: Zap,
  eye: Eye,
  bulb: Lightbulb,
  book: BookOpenCheck,
  trophy: Trophy,
};

const TONES: Record<AchievementTone, string> = {
  1: "bg-chapter-1",
  2: "bg-chapter-2",
  3: "bg-chapter-3",
  4: "bg-chapter-4",
  5: "bg-chapter-5",
  primary: "bg-primary-soft",
  accent: "bg-accent",
  secondary: "bg-secondary",
  success: "bg-success-soft",
};

/** One badge on the wall: colored sticker when earned, dashed grey card when locked. */
export function AchievementCard({ state }: { state: AchievementState }) {
  const { t } = useTranslation();
  const { achievement, value, unlocked } = state;
  const Icon = ICONS[achievement.icon];

  return (
    <article
      className={cn(
        "doodle-card flex flex-col gap-1 border-2 p-3",
        unlocked ? "border-ink bg-card shadow-comic" : "border-dashed border-ink/25 bg-card/50 text-muted-foreground",
      )}
      data-testid={`achievement-${achievement.id}`}
      data-unlocked={unlocked}
    >
      <span
        className={cn(
          "sticker mb-0.5 flex h-10 w-10 -rotate-3 items-center justify-center border-2",
          unlocked ? cn(TONES[achievement.tone], "border-ink") : "border-ink/20 bg-muted",
        )}
      >
        {unlocked ? <Icon className="h-5 w-5 text-ink" /> : <Lock className="h-4 w-4" />}
      </span>
      <h3 className={cn("font-display text-base leading-tight", unlocked ? "text-foreground" : "text-muted-foreground")}>
        {t(`achievements.${achievement.id}.title`)}
      </h3>
      <p className="text-xs leading-relaxed">{t(`achievements.${achievement.id}.desc`)}</p>
      <span className="mt-auto pt-1 font-sans text-[11px] font-extrabold tabular-nums">
        {unlocked
          ? t("progress.achievement.unlocked")
          : t("progress.achievement.progress", { n: value, total: achievement.target })}
      </span>
    </article>
  );
}
