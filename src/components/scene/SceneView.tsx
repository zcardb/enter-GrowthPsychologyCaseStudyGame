import type { Scene } from "@/game/types";
import { BudgetView } from "./BudgetView";
import { ElevationView } from "./ElevationView";
import { FloorPlanView } from "./FloorPlanView";

interface SceneViewProps {
  scene: Scene;
  emphasis?: ReadonlySet<string>;
  className?: string;
}

/** Dispatches a scene to its renderer. */
export function SceneView({ scene, emphasis, className }: SceneViewProps) {
  switch (scene.kind) {
    case "plan":
      return <FloorPlanView scene={scene} emphasis={emphasis} className={className} />;
    case "elevation":
      return <ElevationView scene={scene} emphasis={emphasis} className={className} />;
    case "budget":
      return <BudgetView scene={scene} emphasis={emphasis} className={className} />;
  }
}
