import type { ReactNode } from "react";

interface StageShellProps {
  children: ReactNode;
  actions?: ReactNode;
}

/** Text column layout: scrollable content + pinned action bar. */
export function StageShell({ children, actions }: StageShellProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-0.5 pb-2 pt-1">{children}</div>
      {actions && <div className="flex shrink-0 items-center gap-2 border-t-2 border-dashed border-ink/20 pt-2.5">{actions}</div>}
    </div>
  );
}
