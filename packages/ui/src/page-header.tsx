import { type ReactNode } from "react";

import { cn } from "./utils";

export type PageHeaderProps = {
  actions?: ReactNode;
  breadcrumb?: string[];
  className?: string;
  description?: string;
  eyebrow?: string;
  title: string;
};

export function PageHeader({ actions, breadcrumb, className, description, eyebrow, title }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        {breadcrumb?.length ? (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
            {breadcrumb.map((item, index) => (
              <span className="flex items-center gap-2" key={`${item}-${index}`}>
                {index > 0 ? <span className="text-slate-300">/</span> : null}
                <span>{item}</span>
              </span>
            ))}
          </div>
        ) : null}
        {eyebrow ? <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
