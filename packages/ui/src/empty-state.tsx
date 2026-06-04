import { type ReactNode } from "react";

import { cn } from "./utils";

export type EmptyStateProps = {
  action?: ReactNode;
  className?: string;
  description?: string;
  icon?: ReactNode;
  title: string;
};

export function EmptyState({ action, className, description, icon, title }: EmptyStateProps) {
  return (
    <div className={cn("rounded-3xl border border-dashed border-border bg-white/80 p-8 text-center", className)}>
      {icon ? <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">{icon}</div> : null}
      <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
