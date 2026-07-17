"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles } from "lucide-react";
import { clsx } from "clsx";

type AboutKesiaSectionProps = {
  frauncesClassName: string;
  nunitoClassName: string;
};

type Specialty = {
  id: "bridal" | "events" | "color" | "finishing";
  number: string;
  title: string;
  description: string;
  side: "left" | "right";
  position: "upper" | "lower";
};

type Portrait = {
  src: string;
  alt: string;
  width: number;
  height: number;
  focalPosition: string;
  backgroundMode: "framed" | "transparent";
};

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const kesiaPortrait: Portrait = {
  src: `${publicBasePath}/images/about/kesia-portrait-placeholder.webp`,
  alt: "Retrato editorial temporário para apresentação de Késia Dutra.",
  width: 941,
  height: 1672,
  focalPosition: "50% 18%",
  backgroundMode: "framed",
};

const specialties: Specialty[] = [
  {
    id: "bridal",
    number: "01",
    title: "Penteados para noivas",
    description: "Criações personalizadas para o seu grande dia.",
    side: "left",
    position: "upper",
  },
  {
    id: "events",
    number: "02",
    title: "Debutantes e festas",
    description: "Produções elegantes para momentos especiais.",
    side: "right",
    position: "upper",
  },
  {
    id: "color",
    number: "03",
    title: "Coloração",
    description: "Tons pensados para valorizar sua beleza natural.",
    side: "left",
    position: "lower",
  },
  {
    id: "finishing",
    number: "04",
    title: "Escova e finalização",
    description: "Cuidado e acabamento em cada detalhe.",
    side: "right",
    position: "lower",
  },
];

const specialtyPlacement: Record<Specialty["id"], string> = {
  bridal:
    "order-3 md:col-start-1 md:row-start-3 xl:top-4 xl:col-start-1 xl:row-start-2",
  events:
    "order-4 md:col-start-2 md:row-start-3 xl:col-start-3 xl:row-start-2",
  color:
    "order-5 md:col-start-1 md:row-start-4 xl:top-4 xl:col-start-1 xl:row-start-3",
  finishing:
    "order-6 md:col-start-2 md:row-start-4 xl:col-start-3 xl:row-start-3",
};

export function AboutKesiaSection({
  frauncesClassName,
  nunitoClassName,
}: AboutKesiaSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const ctx = gsap.context(() => {
      const select = gsap.utils.selector(section);
      const media = gsap.matchMedia();

      media.add(
        "(min-width: 1280px) and (prefers-reduced-motion: no-preference)",
        () => {
          const eyebrow = select<HTMLElement>("[data-about-eyebrow]");
          const eyebrowLine = select<HTMLElement>("[data-about-eyebrow-line]");
          const headlineLines = select<HTMLElement>("[data-about-headline-line]");
          const supporting = select<HTMLElement>("[data-about-supporting]");
          const portrait = select<HTMLElement>("[data-about-portrait]");
          const backgroundWord = select<HTMLElement>("[data-about-background-word]");
          const callouts = select<HTMLElement>("[data-about-callout]");
          const calloutNumbers = select<HTMLElement>("[data-about-number]");
          const calloutContent = select<HTMLElement>("[data-about-callout-content]");
          const separators = select<HTMLElement>("[data-about-separator]");
          const connectorLines = select<HTMLElement>("[data-about-connector-line]");
          const connectorDots = select<HTMLElement>("[data-about-connector-dot]");

          // Keep the introduction readable when this section is opened via an anchor.
          gsap.set(eyebrow, { autoAlpha: 1, y: 0 });
          gsap.set(eyebrowLine, {
            scaleX: 1,
            transformOrigin: "left center",
          });
          gsap.set(headlineLines, { yPercent: 0 });
          gsap.set(supporting, { autoAlpha: 1, y: 0 });
          gsap.set(portrait, { autoAlpha: 1, y: 0, scale: 1 });
          gsap.set(backgroundWord, { y: 14 });
          callouts.forEach((callout) => {
            gsap.set(callout, {
              autoAlpha: 0,
              x: callout.dataset.aboutSide === "left" ? -8 : 8,
            });
          });
          gsap.set(calloutNumbers, { autoAlpha: 0, y: 10 });
          gsap.set(calloutContent, { autoAlpha: 0, y: 10 });
          gsap.set(separators, {
            scaleY: 0,
            transformOrigin: "top center",
          });
          gsap.set(connectorLines, { scaleX: 0 });
          gsap.set(connectorDots, { scale: 0 });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.75,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(backgroundWord, { y: -14, duration: 1 }, 0)
            .to(portrait, { scale: 1.015, duration: 0.66 }, 0.26);

          const stages = [0.24, 0.4, 0.56, 0.72];

          callouts.forEach((callout, index) => {
            const stage = stages[index] ?? 0.24;
            const previous = callouts[index - 1];
            const number = callout.querySelector<HTMLElement>("[data-about-number]");
            const separator = callout.querySelector<HTMLElement>("[data-about-separator]");
            const content = callout.querySelector<HTMLElement>(
              "[data-about-callout-content]",
            );
            const connectorLine = callout.querySelector<HTMLElement>(
              "[data-about-connector-line]",
            );
            const connectorDot = callout.querySelector<HTMLElement>(
              "[data-about-connector-dot]",
            );

            if (!number || !separator || !content || !connectorLine || !connectorDot) {
              return;
            }

            if (previous) {
              timeline.to(previous, { opacity: 0.46, duration: 0.045 }, stage);
            }

            timeline
              .to(
                callout,
                {
                  autoAlpha: 1,
                  x: 0,
                  duration: 0.055,
                  ease: "power2.out",
                },
                stage,
              )
              .to(
                number,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.05,
                  ease: "power2.out",
                },
                stage + 0.01,
              )
              .to(
                separator,
                { scaleY: 1, duration: 0.055, ease: "power2.out" },
                stage + 0.02,
              )
              .to(
                content,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.06,
                  ease: "power2.out",
                },
                stage + 0.025,
              )
              .to(
                connectorLine,
                { scaleX: 1, duration: 0.065, ease: "power2.out" },
                stage + 0.04,
              )
              .to(
                connectorDot,
                { scale: 1, duration: 0.04, ease: "power2.out" },
                stage + 0.065,
              );
          });

          timeline.to(callouts, { opacity: 0.9, duration: 0.1, stagger: 0.012 }, 0.86);

          return () => timeline.kill();
        },
      );

      media.add(
        "(max-width: 1279px) and (prefers-reduced-motion: no-preference)",
        () => {
          const revealNodes = select<HTMLElement>("[data-about-mobile-reveal]");
          const animations = revealNodes.map((node) =>
            gsap.fromTo(
              node,
              { autoAlpha: 0, y: 22 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.72,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: node,
                  start: "top 88%",
                  once: true,
                },
              },
            ),
          );

          return () => animations.forEach((animation) => animation.kill());
        },
      );

      return () => media.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sobre"
      role="region"
      aria-labelledby="sobre-kesia-titulo"
      className={clsx(
        nunitoClassName,
        "about-kesia-scroll relative overflow-clip bg-[var(--color-background-alt)] text-[var(--color-text-strong)] xl:h-[230svh] motion-reduce:xl:h-auto",
      )}
    >
      <div className="about-kesia-sticky relative px-6 py-24 sm:px-8 md:py-28 xl:sticky xl:top-0 xl:h-svh xl:px-[clamp(32px,5vw,88px)] xl:py-[clamp(48px,6vh,84px)] motion-reduce:xl:static motion-reduce:xl:h-auto">
        <BackgroundEditorialWord frauncesClassName={frauncesClassName} />

        <div className="relative z-10 mx-auto flex max-w-[1720px] flex-col gap-y-12 md:grid md:grid-cols-2 md:grid-rows-[auto_auto_auto_auto] md:gap-x-10 md:gap-y-12 xl:h-full xl:grid-cols-[minmax(300px,0.82fr)_minmax(420px,1.05fr)_minmax(300px,0.82fr)] xl:grid-rows-[minmax(clamp(320px,46svh,390px),0.9fr)_88px_88px_minmax(120px,0.7fr)] xl:items-center xl:gap-x-[clamp(30px,4vw,76px)] xl:gap-y-2">
          <AboutKesiaIntro
            frauncesClassName={frauncesClassName}
            className="order-1 md:col-span-2 md:row-start-1 xl:col-span-1 xl:col-start-1 xl:row-start-1 xl:self-start"
          />

          <KesiaPortrait
            portrait={kesiaPortrait}
            className="order-2 md:col-span-2 md:row-start-2 md:mx-auto xl:col-span-1 xl:col-start-2 xl:row-span-4 xl:row-start-1 xl:mx-0 xl:self-stretch"
          />

          <ol className="contents">
            {specialties.map((specialty, index) => (
              <SpecialtyCallout
                key={specialty.id}
                specialty={specialty}
                index={index}
                frauncesClassName={frauncesClassName}
                className={specialtyPlacement[specialty.id]}
              />
            ))}
          </ol>

        </div>
      </div>
    </section>
  );
}

function AboutKesiaIntro({
  frauncesClassName,
  className,
}: {
  frauncesClassName: string;
  className?: string;
}) {
  return (
    <div className={clsx("max-w-[470px]", className)}>
      <div
        data-about-eyebrow
        data-about-mobile-reveal
        className="flex items-center gap-3 text-[0.68rem] font-extrabold uppercase leading-4 tracking-normal text-[var(--color-brand-primary)] sm:text-xs"
      >
        <Sparkles className="size-4 shrink-0" aria-hidden="true" />
        <span>Sobre Késia</span>
        <span
          data-about-eyebrow-line
          aria-hidden="true"
          className="h-px w-12 bg-[var(--color-brand-primary)]/70"
        />
      </div>

      <h2
        id="sobre-kesia-titulo"
        className={clsx(
          frauncesClassName,
          "mt-7 text-[clamp(2.75rem,11vw,4rem)] font-normal leading-[0.94] tracking-normal md:text-[clamp(3.5rem,7vw,5.2rem)] xl:mt-5 xl:text-[clamp(2.9rem,3.4vw,4.8rem)]",
        )}
      >
        {["Antes do", "penteado,", "existe a", "escuta."].map((line) => (
          <span key={line} className="block overflow-hidden pb-[0.05em]">
            <span
              data-about-headline-line
              data-about-mobile-reveal
              className={clsx(
                "block whitespace-nowrap",
                line === "escuta." && "text-[var(--color-brand-primary)]",
              )}
            >
              {line}
            </span>
          </span>
        ))}
      </h2>

      <div aria-hidden="true" className="mt-6 flex w-28 items-center xl:mt-4">
        <span className="h-px flex-1 bg-[var(--color-brand-primary)]/55" />
        <Sparkles className="mx-2 size-3 text-[var(--color-brand-primary)]" />
        <span className="h-px flex-1 bg-[var(--color-brand-primary)]/55" />
      </div>

      <p
        data-about-supporting
        data-about-mobile-reveal
        className="mt-5 max-w-[390px] text-[0.98rem] font-semibold leading-[1.7] text-[var(--color-text-muted)] sm:text-[1.05rem] xl:mt-4 xl:text-[0.9rem] xl:leading-[1.55]"
      >
        Conheço sua história, entendo seu estilo e crio uma beleza que realmente
        combina com você.
      </p>
    </div>
  );
}

function KesiaPortrait({
  portrait,
  className,
}: {
  portrait: Portrait;
  className?: string;
}) {
  return (
    <figure
      data-about-portrait
      data-about-mobile-reveal
      className={clsx(
        "relative mx-auto aspect-[3/4] w-full max-w-[520px] overflow-hidden rounded-[16px] bg-[var(--color-surface-warm)] shadow-[var(--shadow-soft)] xl:h-full xl:max-h-[min(78svh,820px)] xl:max-w-[clamp(420px,36vw,680px)]",
        portrait.backgroundMode === "transparent" && "bg-transparent shadow-none",
        className,
      )}
    >
      <Image
        src={portrait.src}
        alt={portrait.alt}
        width={portrait.width}
        height={portrait.height}
        sizes="(min-width: 1280px) 36vw, (min-width: 768px) 520px, calc(100vw - 48px)"
        quality={92}
        loading="lazy"
        className="h-full w-full object-cover"
        style={{ objectPosition: portrait.focalPosition }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[12%] bg-gradient-to-t from-[var(--color-background-alt)]/75 to-transparent"
      />
    </figure>
  );
}

function SpecialtyCallout({
  specialty,
  index,
  frauncesClassName,
  className,
}: {
  specialty: Specialty;
  index: number;
  frauncesClassName: string;
  className?: string;
}) {
  const connector = <SpecialtyConnector side={specialty.side} />;

  return (
    <li
      data-about-callout
      data-about-mobile-reveal
      data-about-side={specialty.side}
      data-about-index={index}
      className={clsx(
        "group relative grid min-h-[118px] grid-cols-[48px_1px_minmax(0,1fr)] items-center gap-x-4 border-t border-[var(--color-border)] py-6 sm:grid-cols-[58px_1px_minmax(0,1fr)] sm:gap-x-5 xl:flex xl:h-full xl:min-h-0 xl:gap-2 xl:border-t-0 xl:py-1",
        className,
      )}
    >
      {specialty.side === "right" ? connector : null}

      <span
        data-about-number
        className={clsx(
          frauncesClassName,
          "shrink-0 text-[clamp(2.5rem,3.2vw,4rem)] font-normal leading-none tracking-normal text-[var(--color-brand-primary)] xl:w-[clamp(58px,4vw,72px)]",
        )}
        aria-hidden="true"
      >
        {specialty.number}
      </span>

      <span
        data-about-separator
        aria-hidden="true"
        className="h-[76px] w-px shrink-0 bg-[var(--color-border-strong)] xl:h-16"
      />

      <span
        data-about-callout-content
        className={clsx(
          "block min-w-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
          specialty.side === "left"
            ? "xl:group-hover:translate-x-1"
            : "xl:group-hover:-translate-x-1",
        )}
      >
        <span
          className={clsx(
            frauncesClassName,
            "block text-[clamp(1.35rem,1.6vw,1.9rem)] font-normal leading-[1.1] tracking-normal text-[var(--color-text-strong)] xl:text-[clamp(1.15rem,1.3vw,1.65rem)]",
          )}
        >
          {specialty.title}
        </span>
        <span className="mt-2 block max-w-[240px] text-sm font-semibold leading-6 text-[var(--color-text-muted)] xl:mt-1.5 xl:max-w-[220px] xl:text-[0.78rem] xl:leading-5">
          {specialty.description}
        </span>
      </span>

      {specialty.side === "left" ? connector : null}
    </li>
  );
}

function SpecialtyConnector({ side }: { side: Specialty["side"] }) {
  return (
    <span
      aria-hidden="true"
      className="relative hidden h-8 w-[clamp(28px,3vw,52px)] shrink-0 items-center xl:flex"
    >
      <span
        data-about-connector-line
        className="h-px w-full bg-[var(--color-brand-primary-border)] transition-transform duration-500 group-hover:scale-x-[1.06]"
        style={{ transformOrigin: side === "left" ? "left center" : "right center" }}
      />
      <span
        data-about-connector-dot
        className={clsx(
          "absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[var(--color-brand-primary)]",
          side === "left" ? "right-0" : "left-0",
        )}
      />
    </span>
  );
}

function BackgroundEditorialWord({
  frauncesClassName,
}: {
  frauncesClassName: string;
}) {
  return (
    <span
      data-about-background-word
      aria-hidden="true"
      className={clsx(
        frauncesClassName,
        "pointer-events-none absolute left-1/2 top-[46%] hidden -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(12rem,25vw,34rem)] font-normal leading-[0.72] tracking-normal text-[var(--color-brand-watermark)] xl:block",
      )}
    >
      KÉSIA
    </span>
  );
}
