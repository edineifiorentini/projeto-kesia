import {
  ArrowDownUp,
  CheckCircle2,
  Download,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Dictionary, ModuleKey } from "@/lib/i18n/dictionaries";
import { moduleRows } from "@/lib/sample-data";

export function ModulePage({
  t,
  moduleKey,
}: {
  t: Dictionary;
  moduleKey: ModuleKey;
}) {
  const moduleContent = t.modules[moduleKey];
  const rows = moduleRows[moduleKey];

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <p className="text-sm font-medium uppercase tracking-normal text-zinc-500">
            {moduleContent.eyebrow}
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-normal text-zinc-950 sm:text-4xl">
            {moduleContent.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
            {moduleContent.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              {moduleContent.primaryAction}
            </Button>
            <Button variant="secondary">
              <ArrowDownUp className="size-4" aria-hidden="true" />
              {moduleContent.secondaryAction}
            </Button>
            <Button variant="ghost">
              <Download className="size-4" aria-hidden="true" />
              {t.common.export}
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 ring-1 ring-zinc-200">
          <p className="text-sm font-medium text-zinc-900">{t.common.quickActions}</p>
          <div className="mt-4 grid gap-2">
            {moduleContent.highlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-md bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
              >
                <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {moduleContent.stats.map((stat) => (
          <div key={stat} className="rounded-lg bg-white p-4 ring-1 ring-zinc-200">
            <p className="text-sm font-medium text-zinc-900">{stat}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg bg-white ring-1 ring-zinc-200">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 p-4">
          <div>
            <h2 className="text-base font-semibold">{moduleContent.tableTitle}</h2>
            <p className="mt-1 text-sm text-zinc-500">{t.shell.branch}</p>
          </div>
          <ShieldCheck className="size-5 text-zinc-500" aria-hidden="true" />
        </div>

        <div className="divide-y divide-zinc-100">
          {rows.length === 0 ? (
            <p className="p-6 text-sm text-zinc-500">{moduleContent.empty}</p>
          ) : (
            rows.map((row) => (
              <div
                key={`${moduleKey}-${row.title}`}
                className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_120px_120px] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-950">
                    {row.title}
                  </p>
                  <p className="mt-1 truncate text-sm text-zinc-500">{row.meta}</p>
                </div>
                <p className="text-sm font-medium text-zinc-800">{row.value}</p>
                <div className="sm:text-right">
                  <Badge status={row.status}>{t.common.statuses[row.status]}</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
