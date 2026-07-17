"use client";

import { useEffect, useRef, type RefObject } from "react";
import Image from "next/image";
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
import { BrandLogo } from "@/components/brand/brand-logo";
import { PremiumAction } from "@/components/ui/premium-action";

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
const heroPosterSrc = `${publicBasePath}/videos/hero-kesia-poster-hq.webp`;

type ScrollHeroExperienceProps = {
  bookingPath: string;
  frauncesClassName: string;
  nunitoClassName: string;
};

type HeroHeaderProps = {
  bookingPath: string;
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
  const posterRef = useRef<HTMLImageElement | null>(null);
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
    const poster = posterRef.current;
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
      !poster ||
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
      gsap.set(video, { autoAlpha: 1 });
      gsap.set(poster, { autoAlpha: 0 });
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
              video,
              { autoAlpha: 1, duration: 0.06, ease: "power1.out" },
              heroTimeline.mediaStart,
            )
            .to(
              poster,
              { autoAlpha: 0, duration: 0.08, ease: "power1.out" },
              heroTimeline.mediaStart + 0.02,
            )
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
                y: () => (isMobile() ? -12 : -4),
                scale: () =>
                  isMobile() ? 1.12 : isTablet() ? 1.025 : 1.02,
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
        "relative h-[96svh] min-h-[680px] overflow-hidden text-[var(--color-text-strong)] max-lg:min-h-0",
      )}
      style={{ backgroundColor: "#feffff" }}
    >
      <HeroHeader
        bookingPath={bookingPath}
        surfaceRef={headerSurfaceRef}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(90deg, #feffff 0%, #feffff 34%, transparent 62%)",
        }}
      />

      <div
        ref={backgroundWordRef}
        aria-hidden="true"
        className={clsx(
          frauncesClassName,
          "pointer-events-none absolute left-[57%] top-[58%] z-0 hidden -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(10rem,20vw,28rem)] font-bold leading-[0.75] tracking-normal text-[var(--color-brand-watermark)] lg:block",
        )}
      >
        NOIVAS
      </div>

      <HeroMedia mediaRef={mediaRef} posterRef={posterRef} videoRef={videoRef} />

      <div className="pointer-events-none absolute inset-0 z-10 mx-auto grid max-w-[1680px] items-start px-6 pt-[84px] sm:px-[clamp(24px,5vw,48px)] lg:grid-cols-[minmax(320px,0.85fr)_minmax(520px,1.15fr)] lg:items-center lg:px-[clamp(24px,5vw,88px)] lg:pt-0">
        <div className="pointer-events-auto max-w-[700px]">
          <div
            ref={eyebrowRef}
            className="flex items-center gap-3 text-[0.66rem] font-extrabold uppercase leading-4 tracking-normal text-[var(--color-brand-primary)] sm:text-xs"
          >
            <Sparkles className="size-4 shrink-0" aria-hidden="true" />
            <span>Especialista em penteados para noivas</span>
            <span className="hidden h-px w-12 bg-[var(--color-brand-primary)]/60 sm:block" />
          </div>

          <h1
            ref={headlineRef}
            className={clsx(
              frauncesClassName,
              "mt-3 text-[2.25rem] font-bold leading-[0.94] tracking-normal text-[var(--color-text-strong)] sm:mt-5 sm:text-[2.7rem] md:text-[clamp(2.7rem,5vw,3.3rem)] lg:text-[clamp(3rem,4.6vw,5.8rem)]",
            )}
          >
            <span className="block whitespace-nowrap">O penteado que</span>
            <span className="block whitespace-nowrap">encontra a sua</span>
            <span className="block whitespace-nowrap">história.</span>
          </h1>

          <p
            ref={supportingRef}
            className="mt-4 max-w-[460px] text-sm font-semibold leading-5 text-[var(--color-text-muted)] sm:mt-6 sm:text-base sm:leading-7"
          >
            Criações exclusivas para você se reconhecer no seu grande dia.
          </p>

          <div
            ref={actionsRef}
            className="mt-5 flex max-w-[460px] flex-col items-start gap-3 sm:mt-7 sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center"
          >
            <PremiumAction asChild size="lg">
              <Link prefetch={false} href={bookingPath} className="w-full sm:w-auto">
                <CalendarCheck2 data-premium-leading aria-hidden="true" />
                <span>Agendar conversa</span>
                <ArrowRight data-premium-arrow aria-hidden="true" />
              </Link>
            </PremiumAction>
            <a
              href="#galeria"
              className="hidden h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-2 text-sm font-extrabold text-[var(--color-text)] transition hover:text-[var(--color-brand-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:inline-flex sm:border sm:border-[var(--color-border)] sm:px-5"
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
        <p className="text-[0.64rem] font-extrabold uppercase leading-4 tracking-normal text-[var(--color-brand-primary)] sm:text-xs">
          Penteado personalizado para o seu momento
        </p>
        <h2
          className={clsx(
            frauncesClassName,
            "mt-3 text-[2.15rem] font-bold leading-[0.98] tracking-normal text-[var(--color-text-strong)] sm:text-[2.75rem] lg:text-[3.5rem]",
          )}
        >
          Seu grande dia começa aqui.
        </h2>
        <PremiumAction asChild size="md" className="mt-5">
          <Link prefetch={false} href={bookingPath}>
            <CalendarCheck2 data-premium-leading aria-hidden="true" />
            <span>Agendar meu horário</span>
            <ArrowRight data-premium-arrow aria-hidden="true" />
          </Link>
        </PremiumAction>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-[clamp(24px,5vw,88px)] z-20 hidden items-center gap-3 text-[0.65rem] font-extrabold uppercase tracking-normal text-[var(--color-text-muted)] lg:flex"
      >
        <span className="relative h-12 w-px bg-[var(--color-brand-primary)]/45">
          <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 rounded-full bg-[var(--color-brand-primary)]" />
        </span>
        <span>Role para revelar</span>
        <ArrowDown className="size-3.5" aria-hidden="true" />
      </div>
    </section>
  );
}

function HeroMedia({
  mediaRef,
  posterRef,
  videoRef,
}: {
  mediaRef: RefObject<HTMLDivElement | null>;
  posterRef: RefObject<HTMLImageElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  return (
    <div
      ref={mediaRef}
      className="pointer-events-none absolute inset-x-0 bottom-0 top-[clamp(340px,42svh,390px)] z-[1] overflow-hidden will-change-transform sm:top-[420px] lg:inset-0 lg:top-0"
    >
      <video
        ref={videoRef}
        src={heroVideoSrc}
        poster={heroPosterSrc}
        className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain object-bottom opacity-0 mix-blend-multiply lg:left-[66%] lg:h-[88%]"
        style={{ clipPath: "inset(0 2px 0 0)" }}
        muted
        controls={false}
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <Image
        ref={posterRef}
        src={heroPosterSrc}
        alt=""
        width={1920}
        height={1080}
        priority
        fetchPriority="high"
        decoding="sync"
        sizes="100vw"
        quality={92}
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain object-bottom mix-blend-multiply lg:left-[66%] lg:h-[88%]"
        style={{ clipPath: "inset(0 2px 0 0)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[14%]"
        style={{
          background:
            "linear-gradient(to top, #feffff, transparent)",
        }}
      />
    </div>
  );
}

function HeroHeader({
  bookingPath,
  surfaceRef,
}: HeroHeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-50 px-4 pt-[max(14px,env(safe-area-inset-top))] sm:px-6 lg:px-8">
      <div
        ref={surfaceRef}
        className="premium-glass-surface mx-auto grid h-16 max-w-[1680px] grid-cols-[1fr_auto] items-center rounded-[14px] border px-5 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-7"
      >
        <Link
          href="#inicio"
          aria-label="Késia Dutra Cabeleireira - início"
          className="flex w-fit items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand-primary)]"
        >
          <BrandLogo priority className="h-[42px] w-[148px] lg:h-[44px] lg:w-[156px]" />
        </Link>

        <nav
          className="hidden items-center gap-1 text-sm font-bold text-[var(--color-text)] lg:flex"
          aria-label="Navegação principal"
        >
          {heroNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-brand-primary)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <PremiumAction asChild size="sm" variant="solid" className="hidden justify-self-end lg:inline-flex">
          <Link prefetch={false} href={bookingPath}>
            <CalendarCheck2 data-premium-leading aria-hidden="true" />
            <span>Agendar</span>
          </Link>
        </PremiumAction>

        <details className="group relative justify-self-end lg:hidden">
          <summary
            className="grid size-10 cursor-pointer list-none place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-translucent)] text-[var(--color-text-strong)] transition hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            aria-label="Abrir menu"
          >
            <Menu className="size-5" aria-hidden="true" />
          </summary>
          <div className="premium-glass-surface premium-glass-popover absolute right-0 top-14 w-[min(86vw,320px)] rounded-[14px] border p-3">
            {heroNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-extrabold text-[var(--color-text-strong)] hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-brand-primary)]"
              >
                {item.label}
                <ChevronRight className="size-4 text-[var(--color-brand-primary)]" aria-hidden="true" />
              </a>
            ))}
            <PremiumAction asChild size="md" variant="solid" fullWidth className="mt-2">
              <Link prefetch={false} href={bookingPath}>
                <CalendarCheck2 data-premium-leading aria-hidden="true" />
                <span>Agendar horário</span>
              </Link>
            </PremiumAction>
          </div>
        </details>
      </div>
    </header>
  );
}
