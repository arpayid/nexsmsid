import { type ReactNode } from "react";

import { cn } from "./utils";

export type LoadingStateProps = {
  className?: string;
  description?: ReactNode;
  label?: ReactNode;
  minHeight?: string;
};

export function LoadingState({ className, description, label = "Memuat data...", minHeight = "min-h-48" }: LoadingStateProps) {
  return (
    <div className={cn("grid place-items-center rounded-3xl border border-dashed border-border bg-slate-50/80 px-6 py-10 text-center", minHeight, className)}>
      <div>
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="mt-4 text-sm font-black text-slate-700">{label}</p>
        {description ? <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
    </div>
  );
}
