"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CalendarX2,
  CheckCircle2,
  LoaderCircle,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { clsx } from "clsx";

export type BookingWidgetStatus =
  | "loading"
  | "ready"
  | "empty"
  | "unavailable"
  | "error"
  | "confirmation";

export type BookingIntegrationMode =
  | "preview"
  | "internal-component"
  | "external-route"
  | "external-link"
  | "iframe";

export type BookingIntegrationConfig = {
  mode: BookingIntegrationMode;
  bookingUrl: string;
  professionalId?: string;
  defaultServiceId?: string;
  locale: "pt-BR";
  timezone: string;
  whatsappUrl: string;
  whatsappMessage: string;
};

type BookingSectionProps = {
  bookingPath: string;
  frauncesClassName: string;
  nunitoClassName: string;
  whatsappPhone: string;
  widget?: ReactNode;
  widgetStatus?: BookingWidgetStatus;
};

type BookingWidgetShellProps = {
  children: ReactNode;
  status?: BookingWidgetStatus;
  whatsappHref: string;
  onRetry?: () => void;
};

const previewDates = [
  { day: "12", weekday: "QUI" },
  { day: "13", weekday: "SEX" },
  { day: "14", weekday: "SÁB" },
  { day: "15", weekday: "DOM" },
] as const;

const previewTimes = ["09:00", "11:30", "15:00", "17:30"] as const;

const bookingSteps = [
  { number: "01", label: "Serviço" },
  { number: "02", label: "Data e horário" },
  { number: "03", label: "Confirmação" },
] as const;

function buildWhatsAppHref(phone: string) {
  const message =
    "Olá, Késia! Gostaria de conversar sobre um horário para o meu atendimento.";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function BookingSection({
  bookingPath,
  frauncesClassName,
  nunitoClassName,
  whatsappPhone,
  widget,
  widgetStatus = "ready",
}: BookingSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const whatsappHref = buildWhatsAppHref(whatsappPhone);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      const select = gsap.utils.selector(section);

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const eyebrow = select<HTMLElement>("[data-booking-eyebrow]");
        const headlineLines = select<HTMLElement>("[data-booking-headline-line]");
        const supporting = select<HTMLElement>("[data-booking-supporting]");
        const actions = select<HTMLElement>("[data-booking-action]");
        const stepItems = select<HTMLElement>("[data-booking-step]");
        const stepLines = select<HTMLElement>("[data-booking-step-line]");
        const widgetShell = select<HTMLElement>("[data-booking-widget-shell]");
        const previewItems = select<HTMLElement>("[data-booking-preview-item]");

        gsap.set(eyebrow, { autoAlpha: 0, y: 16 });
        gsap.set(headlineLines, { autoAlpha: 0, yPercent: 105 });
        gsap.set(supporting, { autoAlpha: 0, y: 18 });
        gsap.set(actions, { autoAlpha: 0, y: 14 });
        gsap.set(stepItems, { autoAlpha: 0, y: 12 });
        gsap.set(stepLines, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(widgetShell, {
          autoAlpha: 0,
          y: 38,
          scale: 0.982,
          clipPath: "inset(5% 0% 0% 0% round 26px)",
        });
        gsap.set(previewItems, { autoAlpha: 0, y: 10 });

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: section,
              start: "top 76%",
              once: true,
            },
          })
          .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.65 }, 0)
          .to(
            headlineLines,
            { autoAlpha: 1, yPercent: 0, duration: 0.92, stagger: 0.1 },
            0.08,
          )
          .to(supporting, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.38)
          .to(actions, { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.08 }, 0.5)
          .to(
            widgetShell,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0% round 26px)",
              duration: 1.02,
            },
            0.24,
          )
          .to(stepItems, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.12 }, 0.68)
          .to(stepLines, { scaleX: 1, duration: 0.5, stagger: 0.12 }, 0.76)
          .to(previewItems, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.065 }, 0.62);
      });

      media.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            select<HTMLElement>("[data-booking-background-word]"),
            { x: -10 },
            {
              x: 10,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );

          gsap.fromTo(
            select<HTMLElement>("[data-booking-widget-column]"),
            { y: 8 },
            {
              y: -8,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        },
      );
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle("booking-section-visible", entry.isIntersecting);
      },
      { threshold: 0 },
    );

    visibilityObserver.observe(section);

    return () => {
      visibilityObserver.disconnect();
      document.body.classList.remove("booking-section-visible");
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="agendamento"
      aria-labelledby="agendamento-titulo"
      className={clsx(
        nunitoClassName,
        "booking-section relative overflow-clip bg-[#FBF8F3] px-6 py-24 text-[#241C17] md:px-10 md:py-28 xl:px-[clamp(48px,5vw,88px)] xl:py-[clamp(120px,10vw,184px)]",
      )}
    >
      <span
        data-booking-background-word
        aria-hidden="true"
        className={clsx(
          frauncesClassName,
          "pointer-events-none absolute -left-4 top-4 select-none text-[170px] font-normal leading-none text-[#B0896C]/[0.045] md:text-[250px] xl:-left-8 xl:text-[360px]",
        )}
      >
        AGENDAR
      </span>

      <div className="booking-section-grid relative z-10 mx-auto max-w-[1700px]">
        <BookingIntro
          bookingPath={bookingPath}
          frauncesClassName={frauncesClassName}
          whatsappHref={whatsappHref}
        />

        <div data-booking-widget-column className="booking-widget-column">
          <BookingWidgetShell status={widgetStatus} whatsappHref={whatsappHref}>
            {widget ?? (
              <BookingPreview
                bookingPath={bookingPath}
                frauncesClassName={frauncesClassName}
              />
            )}
          </BookingWidgetShell>
        </div>

        <BookingSteps />
      </div>
    </section>
  );
}

function BookingIntro({
  bookingPath,
  frauncesClassName,
  whatsappHref,
}: {
  bookingPath: string;
  frauncesClassName: string;
  whatsappHref: string;
}) {
  return (
    <div className="booking-intro max-w-[700px]">
      <div
        data-booking-eyebrow
        className="flex items-center gap-3 text-xs font-extrabold uppercase text-[#A86143]"
      >
        <Sparkles className="size-4" aria-hidden="true" />
        <span>Agendamento</span>
        <span className="h-px w-12 bg-[#CBAA94]" aria-hidden="true" />
      </div>

      <h2
        id="agendamento-titulo"
        className={clsx(
          frauncesClassName,
          "mt-7 text-[42px] font-normal leading-[0.97] tracking-normal text-[#241C17] sm:text-[60px] lg:text-[70px] xl:text-[78px]",
        )}
      >
        <span className="block overflow-hidden pb-1">
          <span data-booking-headline-line className="block">Seu momento</span>
        </span>
        <span className="block overflow-hidden pb-1">
          <span data-booking-headline-line className="block">começa com um</span>
        </span>
        <span className="block overflow-hidden pb-1">
          <span data-booking-headline-line className="block">
            horário <em className="font-normal text-[#C4613F]">só seu.</em>
          </span>
        </span>
      </h2>

      <p
        data-booking-supporting
        className="mt-7 max-w-[540px] text-base font-semibold leading-7 text-[#746A62] sm:text-lg sm:leading-8"
      >
        Escolha o serviço, encontre um horário disponível e confirme seu atendimento.
      </p>

      <div className="mt-9 flex flex-col items-start gap-5">
        <Link
          data-booking-action
          href={bookingPath}
          className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#C4613F] px-7 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(111,59,38,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#AA4F32] hover:shadow-[0_18px_36px_rgba(111,59,38,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#AA4F32] active:translate-y-0 active:scale-[0.985] sm:w-auto"
        >
          <CalendarDays className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          Ver horários disponíveis
        </Link>

        <a
          data-booking-action
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex min-h-11 items-center gap-2.5 text-sm font-bold text-[#B3593D] underline decoration-[#D6A88F] underline-offset-[7px] transition-colors hover:text-[#963F2B] hover:decoration-[#963F2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3593D]"
        >
          <MessageCircle className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          <span>
            <span className="font-semibold">Prefere conversar?</span> Chame no WhatsApp
          </span>
        </a>
      </div>
    </div>
  );
}

function BookingSteps() {
  return (
    <ol className="booking-steps" aria-label="Etapas do agendamento">
      {bookingSteps.map((step, index) => (
        <li key={step.number} data-booking-step className="booking-step-item">
          <div className="shrink-0">
            <p className="text-base font-extrabold text-[#C4613F]">{step.number}</p>
            <p className="mt-1 text-sm font-extrabold text-[#3B2D25] sm:text-base">
              {step.label}
            </p>
          </div>
          {index < bookingSteps.length - 1 ? (
            <span data-booking-step-line className="booking-step-line" aria-hidden="true">
              <span />
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function BookingWidgetShell({
  children,
  status = "ready",
  whatsappHref,
  onRetry,
}: BookingWidgetShellProps) {
  return (
    <div
      data-booking-widget-shell
      className="booking-widget-shell"
      aria-busy={status === "loading"}
    >
      {status === "ready" ? (
        children
      ) : (
        <BookingWidgetState
          status={status}
          whatsappHref={whatsappHref}
          onRetry={onRetry}
        />
      )}
    </div>
  );
}

function BookingWidgetState({
  status,
  whatsappHref,
  onRetry,
}: {
  status: Exclude<BookingWidgetStatus, "ready">;
  whatsappHref: string;
  onRetry?: () => void;
}) {
  const stateContent = {
    loading: {
      icon: LoaderCircle,
      title: "Carregando horários disponíveis",
      description: "Estamos consultando a agenda.",
    },
    empty: {
      icon: CalendarX2,
      title: "Nenhum horário disponível neste período",
      description: "Escolha outra data ou converse com a Késia pelo WhatsApp.",
    },
    unavailable: {
      icon: CalendarX2,
      title: "A agenda está temporariamente indisponível",
      description: "Você ainda pode solicitar atendimento pelo WhatsApp.",
    },
    error: {
      icon: AlertCircle,
      title: "Não foi possível carregar a agenda",
      description: "Tente novamente ou fale diretamente com a Késia.",
    },
    confirmation: {
      icon: CheckCircle2,
      title: "Seu atendimento foi solicitado",
      description: "Confira os dados e acompanhe a confirmação pelo canal indicado.",
    },
  } as const;
  const content = stateContent[status];
  const Icon = content.icon;

  return (
    <div
      className="flex min-h-[520px] flex-col items-center justify-center px-7 py-12 text-center md:min-h-[560px] xl:min-h-[610px]"
      role="status"
      aria-live="polite"
    >
      <span className="grid size-14 place-items-center rounded-full bg-[#F4EADF] text-[#B45E40]">
        <Icon
          className={clsx("size-6", status === "loading" && "animate-spin")}
          aria-hidden="true"
        />
      </span>
      <h3 className="mt-6 text-xl font-extrabold text-[#30251F]">{content.title}</h3>
      <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-[#746A62]">
        {content.description}
      </p>
      {status === "error" && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-7 min-h-11 rounded-md border border-[#C4613F] px-5 text-sm font-extrabold text-[#A64C30] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#A64C30]"
        >
          Tentar novamente
        </button>
      ) : null}
      {status === "empty" || status === "unavailable" || status === "error" ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[#A64C30] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#A64C30]"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Falar no WhatsApp
        </a>
      ) : null}
    </div>
  );
}

export function BookingPreview({
  bookingPath,
  frauncesClassName,
}: {
  bookingPath: string;
  frauncesClassName: string;
}) {
  const [selectedDate, setSelectedDate] = useState("13");
  const [selectedTime, setSelectedTime] = useState("09:00");

  return (
    <div
      className="booking-preview"
      aria-label="Demonstração visual do futuro sistema de agendamento."
      aria-describedby="booking-preview-notice"
    >
      <div data-booking-preview-item className="text-center">
        <span
          className={clsx(
            frauncesClassName,
            "mx-auto grid size-14 place-items-center rounded-full border border-[#E1C1AE] text-lg font-bold text-[#B96C4C]",
          )}
          aria-hidden="true"
        >
          KD
        </span>
        <h3 className="mt-5 text-xl font-extrabold text-[#352820] sm:text-2xl">
          Selecione uma data
        </h3>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {previewDates.map((date) => {
          const selected = selectedDate === date.day;
          return (
            <button
              key={date.day}
              data-booking-preview-item
              type="button"
              aria-pressed={selected}
              onClick={() => setSelectedDate(date.day)}
              className={clsx(
                "min-h-[92px] rounded-lg border bg-[#FFFDF9] px-3 py-4 text-center transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#C4613F]",
                selected
                  ? "border-[#C4613F]/75 bg-[#FFF7F1] text-[#B75234]"
                  : "border-[#DCCFC4] text-[#493A31] hover:border-[#C4613F]/65 hover:text-[#B75234]",
              )}
            >
              <span className={clsx(frauncesClassName, "block text-3xl leading-none")}>{date.day}</span>
              <span className="mt-2 block text-xs font-extrabold">{date.weekday}</span>
            </button>
          );
        })}
      </div>

      <div className="my-8 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-[#E3D5CA]" />
        <Sparkles className="size-4 text-[#C99C82]" />
        <span className="h-px flex-1 bg-[#E3D5CA]" />
      </div>

      <div data-booking-preview-item>
        <h3 className="text-center text-lg font-extrabold text-[#352820] sm:text-xl">
          Horários disponíveis
        </h3>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previewTimes.map((time) => {
            const selected = selectedTime === time;
            return (
              <button
                key={time}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedTime(time)}
                className={clsx(
                  "min-h-12 rounded-lg border px-3 text-sm font-extrabold transition duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#C4613F]",
                  selected
                    ? "border-[#C4613F]/75 bg-[#FFF7F1] text-[#B75234]"
                    : "border-[#DCCFC4] bg-[#FFFDF9] text-[#493A31] hover:border-[#C4613F]/65",
                )}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>

      <div data-booking-preview-item className="mt-8 text-center">
        <Link
          href={bookingPath}
          className="group mx-auto inline-flex min-h-14 w-full max-w-[330px] items-center justify-center gap-3 rounded-md bg-[#C4613F] px-7 text-sm font-extrabold text-white shadow-[0_12px_26px_rgba(111,59,38,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#AA4F32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#AA4F32] active:translate-y-0"
        >
          Continuar no agendamento
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
        <p
          id="booking-preview-notice"
          className="mx-auto mt-5 max-w-md text-xs font-semibold leading-5 text-[#887A70]"
        >
          Prévia visual. Os horários reais serão carregados pelo sistema de agendamento.
        </p>
      </div>
    </div>
  );
}
