import { type ReactNode } from "react";

import { cn } from "./utils";

type ModuleTone = "violet" | "blue" | "cyan" | "emerald" | "amber" | "slate";

const toneClassName: Record<ModuleTone, string> = {
  violet: "bg-violet-50 text-violet-700 ring-violet-100 group-hover:bg-violet-100",
  blue: "bg-blue-50 text-blue-700 ring-blue-100 group-hover:bg-blue-100",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100 group-hover:bg-cyan-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100 group-hover:bg-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100 group-hover:bg-amber-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200 group-hover:bg-slate-200"
};

export type ModuleCardProps = {
  className?: string;
  description: string;
  href?: string;
  icon?: ReactNode;
  meta?: string;
  title: string;
  tone?: ModuleTone;
};

export function ModuleCard({ className, description, href, icon, meta, title, tone = "violet" }: ModuleCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        {icon ? <div className={cn("rounded-2xl p-3 ring-1", toneClassName[tone])}>{icon}</div> : null}
        {meta ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{meta}</span> : null}
      </div>
      <div className="mt-5">
        <h3 className="font-bold tracking-tight text-slate-950">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </>
  );

  const classes = cn(
    "group block rounded-3xl border border-border bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft",
    className
  );

  if (href) {
    return (
      <a className={classes} href={href}>
        {content}
      </a>
    );
  }

  return <div className={classes}>{content}</div>;
}
