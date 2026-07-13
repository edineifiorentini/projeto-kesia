"use client";

import { useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  CalendarCheck2,
  ChevronRight,
  Menu,
  Sparkles,
} from "lucide-react";
import { clsx } from "clsx";

const heroNavItems = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Penteados", href: "#galeria" },
  { label: "Sobre", href: "#sobre" },
  { label: "Dúvidas", href: "#faq" },
] as const;

const heroTimeline = {
  mediaStart: 0.15,
  supportingExit: 0.15,
  headlineExit: 0.35,
  initialContentEnd: 0.62,
  finalReveal: 0.8,
  mediaEnd: 0.83,
  whatsappReveal: 0.9,
} as const;

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const heroVideoSrc = `${publicBasePath}/videos/hero-kesia-scroll.mp4`;
const heroPosterSrc = `${publicBasePath}/videos/hero-kesia-poster.jpg`;

type ScrollHeroExperienceProps = {
  bookingPath: string;
  frauncesClassName: string;
  nunitoClassName: string;
};

type HeroHeaderProps = {
  bookingPath: string;
  frauncesClassName: string;
  surfaceRef: RefObject<HTMLDivElement | null>;
};

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function ScrollHeroExperience({
  bookingPath,
  frauncesClassName,
  nunitoClassName,
}: ScrollHeroExperienceProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerSurfaceRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const supportingRef = useRef<HTMLParagraphElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const backgroundWordRef = useRef<HTMLDivElement | null>(null);
  const finalContentRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const headerSurface = headerSurfaceRef.current;
    const eyebrow = eyebrowRef.current;
    const headline = headlineRef.current;
    const supporting = supportingRef.current;
    const actions = actionsRef.current;
    const media = mediaRef.current;
    const video = videoRef.current;
    const backgroundWord = backgroundWordRef.current;
    const finalContent = finalContentRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    const floatingWhatsapp = document.querySelector<HTMLElement>(
      "[data-floating-whatsapp]",
    );

    if (
      !section ||
      !headerSurface ||
      !eyebrow ||
      !headline ||
      !supporting ||
      !actions ||
      !media ||
      !video ||
      !backgroundWord ||
      !finalContent ||
      !scrollIndicator
    ) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let videoDuration = 0;
    let targetVideoTime = 0;
    let seekFrame: number | null = null;

    const updateVideoTime = () => {
      seekFrame = null;

      if (videoDuration <= 0) {
        return;
      }

      const nextTime = Math.min(
        videoDuration - 0.04,
        Math.max(0, targetVideoTime),
      );

      if (Math.abs(video.currentTime - nextTime) >= 0.035) {
        video.currentTime = nextTime;
      }
    };

    const requestVideoSeek = (progress: number) => {
      if (videoDuration <= 0) {
        return;
      }

      targetVideoTime = videoDuration * clampProgress(progress);
      if (seekFrame === null) {
        seekFrame = window.requestAnimationFrame(updateVideoTime);
      }
    };

    const setVideoDuration = () => {
      videoDuration = Number.isFinite(video.duration) ? video.duration : 0;
      video.pause();

      if (reduceMotion && videoDuration > 0) {
        video.currentTime = Math.max(0, videoDuration - 0.04);
      }
    };

    video.load();
    setVideoDuration();
    video.addEventListener("loadedmetadata", setVideoDuration);

    if (reduceMotion) {
      gsap.set([eyebrow, headline, supporting, actions], {
        autoAlpha: 1,
        clearProps: "transform",
      });
      gsap.set(media, { xPercent: 0, y: 0, scale: 1 });
      gsap.set(backgroundWord, { autoAlpha: 1, xPercent: 0, scale: 1 });
      gsap.set(finalContent, { autoAlpha: 0 });
      gsap.set(scrollIndicator, { autoAlpha: 0 });
      if (floatingWhatsapp) {
        gsap.set(floatingWhatsapp, { autoAlpha: 1, pointerEvents: "auto" });
      }

      return () => {
        video.removeEventListener("loadedmetadata", setVideoDuration);
      };
    }

    const isDesktop = () => window.innerWidth >= 1024;
    const isTablet = () => window.innerWidth >= 768 && window.innerWidth < 1024;
    const isMobile = () => window.innerWidth < 768;
    const finalMediaOffset = () => (isDesktop() ? -13 : 0);
    const scrollDistanceMultiplier = () =>
      isDesktop() ? 2 : isTablet() ? 1.65 : 1.25;

    const ctx = gsap.context(() => {
      gsap.set(finalContent, { autoAlpha: 0, y: 18 });
      gsap.set(media, {
        xPercent: 0,
        y: () => (isMobile() ? 8 : 0),
        scale: 1,
        transformOrigin: "center bottom",
      });
      gsap.set(backgroundWord, { autoAlpha: 1, xPercent: 0, scale: 1 });
      if (floatingWhatsapp) {
        gsap.set(floatingWhatsapp, {
          autoAlpha: 0,
          pointerEvents: "none",
        });
      }

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () =>
            `+=${Math.round(window.innerHeight * scrollDistanceMultiplier())}`,
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const mediaProgress =
              (self.progress - heroTimeline.mediaStart) /
              (heroTimeline.mediaEnd - heroTimeline.mediaStart);
            requestVideoSeek(mediaProgress);
          },
        },
      });

      timeline
            .to(
              supporting,
              {
                autoAlpha: 0,
                y: -12,
                duration:
                  heroTimeline.headlineExit - heroTimeline.supportingExit,
              },
              heroTimeline.supportingExit,
            )
            .to(
              actions,
              {
                autoAlpha: 0,
                y: -10,
                scale: 0.98,
                duration:
                  heroTimeline.headlineExit - heroTimeline.supportingExit,
              },
              heroTimeline.supportingExit + 0.02,
            )
            .to(
              scrollIndicator,
              {
                autoAlpha: 0,
                y: 14,
                duration: 0.16,
              },
              heroTimeline.supportingExit,
            )
            .to(
              headline,
              {
                autoAlpha: 0,
                x: -30,
                duration:
                  heroTimeline.initialContentEnd - heroTimeline.headlineExit,
              },
              heroTimeline.headlineExit,
            )
            .to(
              eyebrow,
              {
                autoAlpha: 0,
                y: -16,
                duration: 0.22,
              },
              heroTimeline.headlineExit,
            )
            .to(
              media,
              {
                xPercent: finalMediaOffset,
                y: () => (isMobile() ? 0 : -4),
                scale: () => (isDesktop() ? 1.02 : 1.01),
                duration: heroTimeline.mediaEnd - heroTimeline.headlineExit,
              },
              heroTimeline.headlineExit,
            )
            .to(
              backgroundWord,
              {
                autoAlpha: 0.72,
                xPercent: -2,
                scale: 1.025,
                duration: heroTimeline.mediaEnd - heroTimeline.headlineExit,
              },
              heroTimeline.headlineExit,
            )
            .to(
              finalContent,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.16,
                ease: "power1.out",
              },
              heroTimeline.finalReveal,
            )
            .to(
              headerSurface,
              {
                backgroundColor: "rgba(251,250,248,0.82)",
                borderColor: "rgba(61,48,38,0.12)",
                boxShadow: "0 12px 36px rgba(45,34,25,0.06)",
                duration: 0.18,
              },
              0.08,
            );

      if (floatingWhatsapp) {
        timeline
          .set(
            floatingWhatsapp,
            { pointerEvents: "auto" },
            heroTimeline.whatsappReveal,
          )
          .to(
            floatingWhatsapp,
            { autoAlpha: 1, duration: 0.08, ease: "power1.out" },
            heroTimeline.whatsappReveal,
          );
      }
    }, section);

    return () => {
      if (seekFrame !== null) {
        window.cancelAnimationFrame(seekFrame);
      }
      video.removeEventListener("loadedmetadata", setVideoDuration);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className={clsx(
        nunitoClassName,
        "relative h-[100svh] min-h-[700px] overflow-hidden bg-[#FEFFFF] text-[#191817] max-lg:min-h-0",
      )}
    >
      <HeroHeader
        bookingPath={bookingPath}
        frauncesClassName={frauncesClassName}
        surfaceRef={headerSurfaceRef}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,#FBFAF8_0%,#FBFAF8_34%,rgba(251,250,248,0)_62%)]"
      />

      <div
        ref={backgroundWordRef}
        aria-hidden="true"
        className={clsx(
          frauncesClassName,
          "pointer-events-none absolute left-[57%] top-[58%] z-0 hidden -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(10rem,20vw,28rem)] font-bold leading-[0.75] tracking-normal text-[rgba(180,154,122,0.08)] lg:block",
        )}
      >
        NOIVAS
      </div>

      <HeroMedia mediaRef={mediaRef} videoRef={videoRef} />

      <div className="pointer-events-none absolute inset-0 z-10 mx-auto grid max-w-[1680px] items-start px-6 pt-[84px] sm:px-[clamp(24px,5vw,48px)] lg:grid-cols-[minmax(320px,0.85fr)_minmax(520px,1.15fr)] lg:items-center lg:px-[clamp(24px,5vw,88px)] lg:pt-0">
        <div className="pointer-events-auto max-w-[700px]">
          <div
            ref={eyebrowRef}
            className="flex items-center gap-3 text-[0.66rem] font-extrabold uppercase leading-4 tracking-normal text-[#9A7E60] sm:text-xs"
          >
            <Sparkles className="size-4 shrink-0" aria-hidden="true" />
            <span>Especialista em penteados para noivas</span>
            <span className="hidden h-px w-12 bg-[#B49A7A]/60 sm:block" />
          </div>

          <h1
            ref={headlineRef}
            className={clsx(
              frauncesClassName,
              "mt-4 text-[clamp(2.7rem,12vw,3.55rem)] font-bold leading-[0.94] tracking-normal text-[#191817] sm:mt-5 md:text-[clamp(2.7rem,5vw,3.3rem)] lg:text-[clamp(3rem,4.6vw,5.8rem)]",
            )}
          >
            <span className="block whitespace-nowrap">O penteado que</span>
            <span className="block whitespace-nowrap">encontra a sua</span>
            <span className="block whitespace-nowrap">história.</span>
          </h1>

          <p
            ref={supportingRef}
            className="mt-5 max-w-[460px] text-sm font-semibold leading-6 text-[#706C68] sm:mt-6 sm:text-base sm:leading-7"
          >
            Criações exclusivas para você se reconhecer no seu grande dia.
          </p>

          <div
            ref={actionsRef}
            className="mt-6 flex max-w-[460px] flex-col items-start gap-3 sm:mt-7 sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center"
          >
            <Link
              href={bookingPath}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#191817] px-6 text-sm font-extrabold text-white shadow-[0_16px_40px_rgba(45,34,25,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#302D2A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#191817] sm:w-auto"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Agendar conversa
            </Link>
            <a
              href="#galeria"
              className="inline-flex h-11 items-center gap-2 rounded-full px-2 text-sm font-extrabold text-[#3E3A36] transition hover:text-[#8C7155] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B49A7A] sm:border sm:border-[rgba(61,48,38,0.14)] sm:px-5"
            >
              Conhecer penteados
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div
        ref={finalContentRef}
        className="invisible absolute left-6 top-[108px] z-20 max-w-[350px] opacity-0 sm:left-[clamp(24px,5vw,48px)] lg:left-[clamp(48px,7vw,132px)] lg:top-1/2 lg:-translate-y-1/2"
      >
        <p className="text-[0.64rem] font-extrabold uppercase leading-4 tracking-normal text-[#9A7E60] sm:text-xs">
          Penteado personalizado para o seu momento
        </p>
        <h2
          className={clsx(
            frauncesClassName,
            "mt-3 text-[2.15rem] font-bold leading-[0.98] tracking-normal text-[#191817] sm:text-[2.75rem] lg:text-[3.5rem]",
          )}
        >
          Seu grande dia começa aqui.
        </h2>
        <Link
          href={bookingPath}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#191817] px-5 text-sm font-extrabold text-white shadow-[0_14px_36px_rgba(45,34,25,0.12)] transition hover:-translate-y-0.5 hover:bg-[#302D2A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#191817]"
        >
          <CalendarCheck2 className="size-4" aria-hidden="true" />
          Agendar meu horário
        </Link>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-[clamp(24px,5vw,88px)] z-20 hidden items-center gap-3 text-[0.65rem] font-extrabold uppercase tracking-normal text-[#706C68] lg:flex"
      >
        <span className="relative h-12 w-px bg-[#B49A7A]/45">
          <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 rounded-full bg-[#B49A7A]" />
        </span>
        <span>Role para revelar</span>
        <ArrowDown className="size-3.5" aria-hidden="true" />
      </div>
    </section>
  );
}

function HeroMedia({
  mediaRef,
  videoRef,
}: {
  mediaRef: RefObject<HTMLDivElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  return (
    <div
      ref={mediaRef}
      className="pointer-events-none absolute inset-x-0 bottom-0 top-[440px] z-[1] overflow-hidden will-change-transform sm:top-[420px] lg:inset-0 lg:top-0"
    >
      <video
        ref={videoRef}
        src={heroVideoSrc}
        poster={heroPosterSrc}
        className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain object-bottom mix-blend-multiply lg:left-[66%] lg:h-[88%]"
        style={{ clipPath: "inset(0 2px 0 0)", willChange: "contents" }}
        muted
        controls={false}
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-t from-[#FBFAF8] to-transparent" />
    </div>
  );
}

function HeroHeader({
  bookingPath,
  frauncesClassName,
  surfaceRef,
}: HeroHeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-50 px-4 pt-[max(14px,env(safe-area-inset-top))] sm:px-6 lg:px-8">
      <div
        ref={surfaceRef}
        className="mx-auto grid h-14 max-w-[1680px] grid-cols-[1fr_auto] items-center rounded-[14px] border border-[rgba(61,48,38,0.10)] bg-[#FBFAF8]/78 px-3 shadow-[0_10px_32px_rgba(45,34,25,0.04)] backdrop-blur-md sm:px-4 lg:grid-cols-[1fr_auto_1fr]"
      >
        <Link
          href="#inicio"
          className="flex w-fit items-center gap-2.5 text-[#191817] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B49A7A]"
        >
          <span className="grid size-8 place-items-center rounded-full border border-[#B49A7A]/35 bg-[#FBFAF8]/70 text-[#9A7E60]">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className={clsx(frauncesClassName, "text-lg font-bold sm:text-xl")}>
            Késia Dutra
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 text-sm font-bold text-[#4A4642] lg:flex"
          aria-label="Navegação principal"
        >
          {heroNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 transition hover:bg-[#F5F1EC] hover:text-[#191817] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B49A7A]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          href={bookingPath}
          className="hidden h-10 items-center justify-self-end gap-2 rounded-full bg-[#DED2C4] px-5 text-sm font-extrabold text-[#292522] transition hover:bg-[#D2C1AE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A7E60] lg:inline-flex"
        >
          <CalendarCheck2 className="size-4" aria-hidden="true" />
          Agendar
        </Link>

        <details className="group relative justify-self-end lg:hidden">
          <summary
            className="grid size-10 cursor-pointer list-none place-items-center rounded-full border border-[rgba(61,48,38,0.14)] bg-[#FBFAF8]/82 text-[#191817] transition hover:bg-[#F5F1EC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B49A7A]"
            aria-label="Abrir menu"
          >
            <Menu className="size-5" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-12 w-[min(86vw,320px)] rounded-[14px] border border-[rgba(61,48,38,0.14)] bg-[#FBFAF8]/95 p-3 shadow-[0_16px_50px_rgba(45,34,25,0.08)] backdrop-blur-xl">
            {heroNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-extrabold text-[#292522] hover:bg-[#F5F1EC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B49A7A]"
              >
                {item.label}
                <ChevronRight className="size-4 text-[#9A7E60]" aria-hidden="true" />
              </a>
            ))}
            <Link
              href={bookingPath}
              className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#191817] text-sm font-extrabold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#191817]"
            >
              <CalendarCheck2 className="size-4" aria-hidden="true" />
              Agendar horário
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
