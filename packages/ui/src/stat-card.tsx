import { type ReactNode } from "react";

import { Card } from "./card";
import { cn } from "./utils";

type StatTone = "violet" | "blue" | "emerald" | "amber";

const toneClassName: Record<StatTone, string> = {
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100"
};

const trendClassName = {
  positive: "text-emerald-600",
  neutral: "text-slate-500",
  negative: "text-rose-600"
} as const;

export type StatCardProps = {
  className?: string;
  description?: string;
  icon?: ReactNode;
  title: string;
  tone?: StatTone;
  trend?: {
    label: string;
    value: string;
    variant?: keyof typeof trendClassName;
  };
  value: string;
};

export function StatCard({ className, description, icon, title, tone = "violet", trend, value }: StatCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">{title}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        {icon ? (
          <div className={cn("rounded-2xl p-3 ring-1", toneClassName[tone])}>{icon}</div>
        ) : null}
      </div>
      {description || trend ? (
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          {trend ? (
            <span className={cn("font-bold", trendClassName[trend.variant ?? "neutral"])}>{trend.value}</span>
          ) : null}
          <span className="text-muted-foreground">{trend?.label ?? description}</span>
        </div>
      ) : null}
    </Card>
  );
}
