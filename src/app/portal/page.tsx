import Link from "next/link";
import { CalendarClock, Gift, History, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { defaultLocale, getDictionary } from "@/lib/i18n/dictionaries";

export default function PortalPage() {
  const t = getDictionary(defaultLocale);

  const cards = [
    {
      icon: CalendarClock,
      title: t.portal.nextAppointment,
      value: "11/07 · 10:30 · Corte Masculino",
    },
    {
      icon: Gift,
      title: t.portal.packages,
      value: "2 sessoes restantes",
    },
    {
      icon: History,
      title: t.portal.history,
      value: "14 visitas registradas",
    },
    {
      icon: Star,
      title: t.portal.review,
      value: "4,9 media",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f6f4ef] px-4 py-8 text-zinc-950">
      <section className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm font-medium text-zinc-600">
          {t.common.appName}
        </Link>
        <div className="mt-8 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            {t.portal.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-zinc-600">
            {t.portal.description}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="rounded-lg bg-white p-4 ring-1 ring-zinc-200">
                <span className="grid size-10 place-items-center rounded-md bg-zinc-950 text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-sm font-medium text-zinc-600">
                  {card.title}
                </h2>
                <p className="mt-2 text-base font-semibold text-zinc-950">
                  {card.value}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-8">
          <ButtonLink href="/booking/kesia-dutra-cabeleireira">
            <CalendarClock className="size-4" aria-hidden="true" />
            {t.common.newAppointment}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
