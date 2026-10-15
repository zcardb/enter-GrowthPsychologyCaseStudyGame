import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Scene } from "@/game/types";
import { cn } from "@/lib/utils";
import { SceneView } from "./SceneView";

interface BeforeAfterProps {
  before: Scene;
  after: Scene;
  changed: ReadonlySet<string>;
  afterLabel?: string;
}

/** Toggle between the original scene and the chosen option; changes are highlighted. */
export function BeforeAfter({ before, after, changed, afterLabel }: BeforeAfterProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<"before" | "after">("after");

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex shrink-0 justify-start p-1">
        <div className="flex rounded-full border-2 border-ink bg-card p-0.5 text-xs font-bold shadow-comic">
        {(["before", "after"] as const).map((v) => (
          <button
            key={v}
            type="button"
            data-testid={`compare-${v}`}
            onClick={() => setView(v)}
            className={cn(
              "min-h-[32px] rounded-full px-3 transition-colors",
              view === v ? "bg-ink text-paper" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {v === "before" ? t("play.compare.before") : (afterLabel ?? t("play.compare.after"))}
          </button>
        ))}
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <SceneView scene={view === "after" ? after : before} emphasis={view === "after" ? changed : undefined} />
      </div>
    </div>
  );
}
