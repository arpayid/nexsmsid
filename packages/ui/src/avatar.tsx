import { type HTMLAttributes } from "react";

import { cn } from "./utils";

export type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  alt?: string;
  fallback: string;
  src?: string;
};

export function Avatar({ alt, className, fallback, src, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white bg-indigo-100 text-sm font-bold text-indigo-700 shadow-sm",
        className
      )}
      {...props}
    >
      {src ? (
        <img alt={alt ?? fallback} className="h-full w-full object-cover" src={src} />
      ) : (
        <span className="grid h-full w-full place-items-center">{fallback}</span>
      )}
    </div>
  );
}
