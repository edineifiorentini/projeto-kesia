import type { ReactNode } from "react";
import { clsx } from "clsx";

export function MetricCard({
  label,
  value,
  trend,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  trend?: string;
  icon: ReactNode;
  tone?: "default" | "green" | "amber" | "rose";
}) {
  const tones = {
    default: "bg-zinc-50 text-zinc-900 ring-zinc-200",
    green: "bg-emerald-50 text-emerald-950 ring-emerald-100",
    amber: "bg-amber-50 text-amber-950 ring-amber-100",
    rose: "bg-rose-50 text-rose-950 ring-rose-100",
  };

  return (
    <article className={clsx("rounded-lg p-4 ring-1", tones[tone])}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-zinc-600">{label}</span>
        <span className="grid size-9 place-items-center rounded-md bg-white/80 text-zinc-700 ring-1 ring-black/5">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-normal text-zinc-950">
        {value}
      </p>
      {trend ? <p className="mt-1 text-sm text-zinc-600">{trend}</p> : null}
    </article>
  );
}
