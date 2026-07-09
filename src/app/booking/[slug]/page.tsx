import { CalendarDays, Clock, MessageCircle, Scissors, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultLocale, getDictionary } from "@/lib/i18n/dictionaries";
import { landingPageData } from "@/lib/landing-page-data";

const services = landingPageData.services.items.map((service) => service.name);
const professionals = ["Qualquer profissional", landingPageData.professionalName];
const times = ["09:00", "10:30", "11:00", "14:00", "15:30", "17:00"];

export default function BookingPage() {
  const t = getDictionary(defaultLocale);

  return (
    <main className="min-h-screen bg-[#FFF8F4] px-4 py-5 text-[#2B1D1A]">
      <section className="mx-auto flex min-h-[calc(100vh-40px)] max-w-5xl flex-col gap-6 rounded-xl bg-white p-4 ring-1 ring-[#E7D8CF] sm:p-6 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-between rounded-lg bg-[#2B1D1A] p-5 text-white">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-white text-[#8C5A4A]">
                <Scissors className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-white/68">{t.common.appName}</p>
                <h1 className="text-xl font-semibold">{t.common.businessName}</h1>
              </div>
            </div>
            <div className="mt-10">
              <h2 className="text-3xl font-semibold tracking-normal">
                {t.booking.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/70">
                {t.booking.description}
              </p>
            </div>
          </div>
          <p className="mt-10 text-sm text-white/68">{t.booking.policy}</p>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-[#7A625B]">
              <Scissors className="size-4" aria-hidden="true" />
              {t.booking.chooseService}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {services.map((service) => (
                <button
                  type="button"
                  key={service}
                  className="rounded-lg border border-[#E7D8CF] bg-white p-3 text-left text-sm font-medium transition hover:border-[#8C5A4A]"
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-[#7A625B]">
              <UserRound className="size-4" aria-hidden="true" />
              {t.booking.chooseProfessional}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {professionals.map((professional, index) => (
                <button
                  type="button"
                  key={professional}
                  className="rounded-lg border border-[#E7D8CF] bg-white p-3 text-left text-sm font-medium transition hover:border-[#8C5A4A]"
                >
                  {index === 0 ? t.booking.anyProfessional : professional}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-[#7A625B]">
              <Clock className="size-4" aria-hidden="true" />
              {t.booking.chooseTime}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {times.map((time) => (
                <button
                  type="button"
                  key={time}
                  className="rounded-lg border border-[#E7D8CF] bg-[#FFF8F4] px-3 py-3 text-sm font-semibold transition hover:border-[#8C5A4A] hover:bg-white"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-[#7A625B]">
                {t.booking.clientName}
              </span>
              <input className="mt-2 h-11 w-full rounded-md border border-[#E7D8CF] px-3 text-sm outline-none focus:border-[#8C5A4A]" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#7A625B]">
                {t.booking.phone}
              </span>
              <input className="mt-2 h-11 w-full rounded-md border border-[#E7D8CF] px-3 text-sm outline-none focus:border-[#8C5A4A]" />
            </label>
          </div>

          <Button className="w-full bg-[#8C5A4A] hover:bg-[#744638] focus-visible:outline-[#8C5A4A]">
            <MessageCircle className="size-4" aria-hidden="true" />
            {t.booking.confirm}
          </Button>

          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
            <CalendarDays className="size-4" aria-hidden="true" />
            {t.common.timezone}
          </div>
        </div>
      </section>
    </main>
  );
}
