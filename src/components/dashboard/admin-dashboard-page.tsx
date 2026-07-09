import {
  Banknote,
  CalendarCheck2,
  CircleDollarSign,
  PackageSearch,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import { formatMoney } from "@/lib/format";
import { defaultLocale, getDictionary } from "@/lib/i18n/dictionaries";
import {
  dashboardMetrics,
  openCommands,
  professionalPerformance,
  revenueSeries,
  stockAlerts,
  todayAppointments,
} from "@/lib/sample-data";

export function AdminDashboardPage() {
  const t = getDictionary(defaultLocale);
  const maxRevenue = Math.max(...revenueSeries);

  return (
    <AppShell t={t} active="dashboard">
      <div className="space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-normal text-zinc-500">
              {t.common.today}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950 sm:text-4xl">
              {t.dashboard.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
              {t.dashboard.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button>
              <CalendarCheck2 className="size-4" aria-hidden="true" />
              {t.common.newAppointment}
            </Button>
            <Button variant="secondary">
              <ReceiptText className="size-4" aria-hidden="true" />
              {t.common.openCommand}
            </Button>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label={t.dashboard.metrics.revenue}
            value={formatMoney(dashboardMetrics.revenueCents)}
            trend={t.dashboard.trends.revenue}
            icon={<Banknote className="size-5" aria-hidden="true" />}
            tone="green"
          />
          <MetricCard
            label={t.dashboard.metrics.appointments}
            value={String(dashboardMetrics.appointments)}
            trend={t.dashboard.trends.appointments}
            icon={<CalendarCheck2 className="size-5" aria-hidden="true" />}
          />
          <MetricCard
            label={t.dashboard.metrics.averageTicket}
            value={formatMoney(dashboardMetrics.averageTicketCents)}
            trend={t.common.thisMonth}
            icon={<TrendingUp className="size-5" aria-hidden="true" />}
          />
          <MetricCard
            label={t.dashboard.metrics.occupancy}
            value={`${dashboardMetrics.occupancy}%`}
            trend={t.shell.branch}
            icon={<CircleDollarSign className="size-5" aria-hidden="true" />}
            tone="amber"
          />
          <MetricCard
            label={t.dashboard.metrics.pendingCommissions}
            value={formatMoney(dashboardMetrics.pendingCommissionsCents)}
            trend={t.common.statuses.pending}
            icon={<ReceiptText className="size-5" aria-hidden="true" />}
          />
          <MetricCard
            label={t.dashboard.metrics.lowStock}
            value={String(dashboardMetrics.lowStockCount)}
            trend={t.common.statuses.lowStock}
            icon={<PackageSearch className="size-5" aria-hidden="true" />}
            tone="rose"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <article className="rounded-lg bg-white ring-1 ring-zinc-200">
            <div className="border-b border-zinc-200 p-4">
              <h2 className="text-base font-semibold">
                {t.dashboard.sections.todaySchedule}
              </h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {todayAppointments.map((appointment) => {
                const status = appointment.status as keyof typeof t.common.statuses;

                return (
                  <div
                    key={`${appointment.time}-${appointment.client}`}
                    className="grid gap-3 p-4 sm:grid-cols-[72px_minmax(0,1fr)_120px] sm:items-center"
                  >
                    <p className="text-sm font-semibold text-zinc-950">
                      {appointment.time}
                    </p>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-950">
                        {appointment.client}
                      </p>
                      <p className="mt-1 truncate text-sm text-zinc-500">
                        {appointment.service} · {appointment.professional}
                      </p>
                    </div>
                    <Badge status={status}>{t.common.statuses[status]}</Badge>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-lg bg-white p-4 ring-1 ring-zinc-200">
            <h2 className="text-base font-semibold">
              {t.dashboard.sections.revenueChart}
            </h2>
            <div className="mt-5 flex h-56 items-end gap-3">
              {revenueSeries.map((value, index) => (
                <div
                  key={`${value}-${index}`}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex h-44 w-full items-end rounded-md bg-zinc-100">
                    <div
                      className="w-full rounded-md bg-emerald-600"
                      style={{ height: `${Math.max((value / maxRevenue) * 100, 8)}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500">
                    {t.common.weekdays[index]}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <article className="rounded-lg bg-white p-4 ring-1 ring-zinc-200">
            <h2 className="text-base font-semibold">
              {t.dashboard.sections.quickCheckout}
            </h2>
            <div className="mt-4 space-y-3">
              {openCommands.map((command) => {
                const status = command.status as keyof typeof t.common.statuses;
                return (
                  <div key={command.client} className="rounded-lg bg-zinc-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{command.client}</p>
                        <p className="mt-1 text-sm text-zinc-500">{command.items}</p>
                      </div>
                      <Badge status={status}>{t.common.statuses[status]}</Badge>
                    </div>
                    <p className="mt-3 text-lg font-semibold">
                      {formatMoney(command.amountCents)}
                    </p>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-lg bg-white p-4 ring-1 ring-zinc-200">
            <h2 className="text-base font-semibold">
              {t.dashboard.sections.stockAlerts}
            </h2>
            <div className="mt-4 space-y-3">
              {stockAlerts.map((item) => (
                <div key={item.name} className="rounded-lg bg-rose-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-rose-950">{item.name}</p>
                    <Badge status="lowStock">{t.common.statuses.lowStock}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-rose-700">
                    {item.quantity}/{item.minimum}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg bg-white p-4 ring-1 ring-zinc-200">
            <h2 className="text-base font-semibold">
              {t.dashboard.sections.professionals}
            </h2>
            <div className="mt-4 space-y-4">
              {professionalPerformance.map((professional) => (
                <div key={professional.name}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{professional.name}</p>
                    <p className="text-sm font-semibold">
                      {formatMoney(professional.revenueCents)}
                    </p>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-zinc-100">
                    <div
                      className="h-2 rounded-full bg-zinc-950"
                      style={{ width: `${professional.occupancy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
