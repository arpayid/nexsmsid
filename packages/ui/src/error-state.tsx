import { type ReactNode } from "react";

import { Button } from "./button";
import { cn } from "./utils";

export type ErrorStateProps = {
  action?: ReactNode;
  className?: string;
  message?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  title?: ReactNode;
};

export function ErrorState({ action, className, message, onRetry, retryLabel = "Coba lagi", title = "Terjadi kesalahan" }: ErrorStateProps) {
  return (
    <div className={cn("rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-800", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rose-100 text-sm font-black">!</span>
          <div>
            <p className="text-sm font-black">{title}</p>
            {message ? <p className="mt-1 text-sm font-semibold leading-6 text-rose-700">{message}</p> : null}
          </div>
        </div>
        {action ?? (onRetry ? <Button onClick={onRetry} size="sm" variant="outline">{retryLabel}</Button> : null)}
      </div>
    </div>
  );
}
