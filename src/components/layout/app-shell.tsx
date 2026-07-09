import Link from "next/link";
import {
  BarChart3,
  Boxes,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Globe2,
  Home,
  LayoutDashboard,
  LogOut,
  Megaphone,
  PackageCheck,
  Scissors,
  Search,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Button, ButtonLink } from "@/components/ui/button";

type NavKey = keyof Dictionary["nav"];

const navItems: Array<{ key: NavKey; href: string; icon: React.ElementType }> = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "calendar", href: "/admin/calendar", icon: CalendarDays },
  { key: "clients", href: "/admin/clients", icon: Users },
  { key: "professionals", href: "/admin/professionals", icon: Scissors },
  { key: "services", href: "/admin/services", icon: ClipboardList },
  { key: "commands", href: "/admin/commands", icon: CreditCard },
  { key: "financial", href: "/admin/financial", icon: BarChart3 },
  { key: "inventory", href: "/admin/inventory", icon: Boxes },
  { key: "marketing", href: "/admin/marketing", icon: Megaphone },
  { key: "reports", href: "/admin/reports", icon: PackageCheck },
  { key: "settings", href: "/admin/settings", icon: Settings },
];

export function AppShell({
  t,
  active,
  children,
}: {
  t: Dictionary;
  active: NavKey;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f4ef] text-zinc-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-zinc-200 bg-white/85 px-4 py-5 lg:block">
          <Link href="/admin" className="flex items-center gap-3 rounded-lg px-2">
            <span className="grid size-10 place-items-center rounded-lg bg-zinc-950 text-white">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-semibold">{t.common.appName}</span>
              <span className="block text-xs text-zinc-500">{t.shell.plan}</span>
            </span>
          </Link>

          <nav className="mt-8 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const selected = item.key === active;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                    selected
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                  }`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {t.nav[item.key]}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-950 ring-1 ring-emerald-100">
            <p className="font-medium">{t.shell.occupancy}</p>
            <div className="mt-3 h-2 rounded-full bg-emerald-100">
              <div className="h-2 w-[78%] rounded-full bg-emerald-600" />
            </div>
            <p className="mt-2 text-emerald-700">78%</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
            <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-500">
                <Search className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{t.common.search}</span>
              </div>
              <ButtonLink href="/" variant="ghost">
                <Home className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Site</span>
              </ButtonLink>
              <ButtonLink href="/booking/kesia-dutra-cabeleireira" variant="secondary">
                <Globe2 className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t.nav.booking}</span>
              </ButtonLink>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{t.common.businessName}</p>
                <p className="text-xs text-zinc-500">{t.shell.role}</p>
              </div>
              <form action="/api/auth/logout" method="post">
                <Button type="submit" variant="ghost" aria-label="Sair">
                  <LogOut className="size-4" aria-hidden="true" />
                </Button>
              </form>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
