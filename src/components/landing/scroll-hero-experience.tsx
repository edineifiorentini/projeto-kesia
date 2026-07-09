"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CalendarCheck2,
  ChevronRight,
  LoaderCircle,
  LockKeyhole,
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

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const heroVideoSrc = `${publicBasePath}/videos/hero-kesia-scroll.mp4`;
const heroPosterSrc = `${publicBasePath}/videos/hero-kesia-poster.jpg`;

type ScrollHeroExperienceProps = {
  bookingPath: string;
  frauncesClassName: string;
  nunitoClassName: string;
};

export function ScrollHeroExperience({
  bookingPath,
  frauncesClassName,
  nunitoClassName,
}: ScrollHeroExperienceProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const buildingNoticeRef = useRef<HTMLDivElement | null>(null);
  const confirmedNoticeRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const copy = copyRef.current;
    const videoWrap = videoWrapRef.current;
    const video = videoRef.current;
    const buildingNotice = buildingNoticeRef.current;
    const confirmedNotice = confirmedNoticeRef.current;
    const scrollHint = scrollHintRef.current;

    if (!section || !copy || !videoWrap || !video || !buildingNotice || !confirmedNotice) {
      return;
    }

    let videoDuration = 0;
    let targetVideoTime = 0;
    let seekFrame: number | null = null;

    const updateVideoTime = () => {
      seekFrame = null;

      if (videoDuration <= 0) {
        return;
      }

      const nextTime = Math.min(videoDuration - 0.04, Math.max(0, targetVideoTime));
      if (Math.abs(video.currentTime - nextTime) < 0.04) {
        return;
      }

      video.currentTime = nextTime;
    };

    const requestVideoSeek = (progress: number) => {
      if (videoDuration <= 0) {
        return;
      }

      targetVideoTime = videoDuration * progress;
      if (seekFrame === null) {
        seekFrame = window.requestAnimationFrame(updateVideoTime);
      }
    };

    const setVideoDuration = () => {
      videoDuration = Number.isFinite(video.duration) ? video.duration : 0;
      video.pause();
    };

    video.load();
    setVideoDuration();
    video.addEventListener("loadedmetadata", setVideoDuration);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set(copy, { autoAlpha: 1 });
      gsap.set(videoWrap, { scale: 1, y: 0 });
      gsap.set(buildingNotice, { autoAlpha: 0 });
      gsap.set(confirmedNotice, { autoAlpha: 1, y: 0, scale: 1 });
      return () => {
        video.removeEventListener("loadedmetadata", setVideoDuration);
      };
    }

    const ctx = gsap.context(() => {
      gsap.set(buildingNotice, { autoAlpha: 0, y: 18, scale: 0.96 });
      gsap.set(confirmedNotice, { autoAlpha: 0, y: 18, scale: 0.96 });
      gsap.set(videoWrap, {
        scale: 1,
        y: 18,
        transformOrigin: "center bottom",
      });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=5200",
          pin: true,
          scrub: 0.95,
          anticipatePin: 1,
          onUpdate: (self) => {
            requestVideoSeek(self.progress);
          },
        },
      });

      timeline
        .to(
          copy,
          {
            autoAlpha: 0,
            y: -18,
            scale: 0.99,
            duration: 0.045,
          },
          0.03,
        )
        .to(
          scrollHint,
          {
            autoAlpha: 0,
            y: 16,
            duration: 0.08,
          },
          0.03,
        )
        .to(
          videoWrap,
          {
            scale: 1.006,
            y: -6,
            duration: 0.74,
          },
          0,
        )
        .to(
          buildingNotice,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.04,
          },
          0.08,
        )
        .to(
          buildingNotice,
          {
            autoAlpha: 0,
            y: -14,
            scale: 0.98,
            duration: 0.08,
          },
          0.47,
        )
        .to(
          confirmedNotice,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.08,
          },
          0.52,
        )
        .to(
          videoWrap,
          {
            scale: 1.008,
            y: -8,
            duration: 0.28,
          },
          0.52,
        );
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
        "relative min-h-screen overflow-hidden bg-white text-[#141414]",
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_4%,rgba(185,74,47,0.035),transparent_42%)]" />

      <GlassHeroMenu bookingPath={bookingPath} frauncesClassName={frauncesClassName} />

      <div
        ref={copyRef}
        className="absolute left-1/2 top-[112px] z-10 w-full max-w-[1760px] -translate-x-1/2 px-5 text-center sm:top-[126px] sm:px-6 lg:top-[136px] lg:px-8"
      >
        <h1
          aria-label="Porque todo grande dia merece um cabelo à altura da sua história."
          className={clsx(
            frauncesClassName,
            "mx-auto max-w-[min(1760px,calc(100vw-3rem))] whitespace-nowrap text-[clamp(1.42rem,2.22vw,2.72rem)] font-bold leading-none tracking-normal text-[#111111] max-lg:whitespace-normal max-sm:max-w-[350px] max-sm:text-[clamp(1.55rem,7vw,1.88rem)] max-sm:leading-[0.98]",
          )}
        >
          Porque todo grande dia merece um cabelo à altura da sua história.
        </h1>
        <p className="mx-auto mt-4 max-w-[1180px] text-[0.92rem] font-semibold leading-6 text-[#6d6d6d] sm:text-[0.98rem] max-lg:max-w-[720px] max-sm:mt-3 max-sm:max-w-[335px] max-sm:overflow-hidden max-sm:text-[0.76rem] max-sm:leading-5 max-sm:[-webkit-box-orient:vertical] max-sm:[-webkit-line-clamp:2] max-sm:[display:-webkit-box]">
          <span className="block whitespace-nowrap max-lg:whitespace-normal">
            Do primeiro olhar ao último registro, cada detalhe importa. Penteados, coloração, lavagem, escova e finalização
          </span>
          {" "}
          <span className="block whitespace-nowrap max-lg:whitespace-normal">
            para noivas, debutantes e festas, com cuidado, delicadeza e beleza feita para emocionar.
          </span>
        </p>
      </div>

      <div
        ref={videoWrapRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[322px] z-[1] flex origin-bottom transform-gpu items-end justify-center overflow-hidden bg-white will-change-transform sm:top-[248px] lg:top-[255px]"
      >
        <video
          ref={videoRef}
          src={heroVideoSrc}
          poster={heroPosterSrc}
          className="h-[98%] w-auto max-w-none scale-100 transform-gpu object-contain object-center sm:h-full sm:scale-[1.006]"
          style={{ clipPath: "inset(0 2px 0 0)", willChange: "transform" }}
          muted
          controls={false}
          playsInline
          preload="auto"
        />
      </div>

      <div
        ref={buildingNoticeRef}
        className="pointer-events-none absolute left-1/2 top-[166px] z-20 -translate-x-1/2 rounded-full border border-black/5 bg-white/88 px-5 py-3 text-[#5a5a5a] opacity-0 shadow-[0_14px_42px_rgba(20,20,20,0.12)] backdrop-blur-2xl sm:top-[176px]"
      >
        <div className="flex items-center gap-3 text-sm font-bold">
          <LoaderCircle className="size-4 animate-spin text-[#9d9d9d]" aria-hidden="true" />
          Construindo seu momento
        </div>
      </div>

      <div
        ref={confirmedNoticeRef}
        className="absolute left-1/2 top-[166px] z-20 max-w-[calc(100vw-24px)] -translate-x-1/2 rounded-full border border-black/5 bg-white/90 p-1 opacity-0 shadow-[0_14px_42px_rgba(20,20,20,0.12)] backdrop-blur-2xl sm:top-[176px] sm:p-1.5"
      >
        <div className="flex items-center gap-1.5 pl-2 text-xs font-bold text-[#5a5a5a] sm:gap-2 sm:pl-3 sm:text-sm">
          <span className="size-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.14)]" />
          <span className="whitespace-nowrap">Sonho confirmado</span>
          <Link
            href={bookingPath}
            className="ml-1 inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-black px-3 text-xs font-extrabold text-white transition hover:bg-[#242424] sm:h-10 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <LockKeyhole className="size-4" aria-hidden="true" />
            Agendar horário
          </Link>
        </div>
      </div>

      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 text-xs font-extrabold uppercase tracking-normal text-black/40 sm:block"
      >
        Role para revelar
      </div>
    </section>
  );
}

function GlassHeroMenu({
  bookingPath,
  frauncesClassName,
}: {
  bookingPath: string;
  frauncesClassName: string;
}) {
  return (
    <header className="fixed left-0 right-0 top-5 z-50 px-4">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-3">
        <Link
          href="#inicio"
          className="flex h-11 items-center gap-3 rounded-full border border-white/45 bg-white/42 px-2.5 pr-4 text-[#151515] shadow-[0_12px_38px_rgba(20,20,20,0.10)] backdrop-blur-2xl"
        >
          <span className="grid size-9 place-items-center rounded-full bg-white/46 text-[#B94A2F] ring-1 ring-white/45">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <span className={clsx(frauncesClassName, "text-lg font-black")}>
            Késia Dutra
          </span>
        </Link>

        <nav className="hidden h-11 items-center gap-1 rounded-full border border-white/45 bg-white/42 px-2 text-sm font-bold text-[#202020] shadow-[0_12px_38px_rgba(20,20,20,0.10)] backdrop-blur-2xl lg:flex">
          {heroNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-5 py-2 transition hover:bg-white/42"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          href={bookingPath}
          className="hidden h-11 items-center gap-2 rounded-full border border-white/45 bg-white/42 px-5 text-sm font-extrabold text-[#151515] shadow-[0_12px_38px_rgba(20,20,20,0.10)] backdrop-blur-2xl transition hover:bg-white/62 md:inline-flex"
        >
          <CalendarCheck2 className="size-4" aria-hidden="true" />
          Agendar
        </Link>

        <details className="group relative md:hidden">
          <summary
            className="grid size-12 cursor-pointer list-none place-items-center rounded-full border border-white/45 bg-white/42 text-[#151515] shadow-[0_12px_38px_rgba(20,20,20,0.10)] backdrop-blur-2xl"
            aria-label="Abrir menu"
          >
            <Menu className="size-5" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-14 w-[min(86vw,320px)] rounded-2xl border border-white/45 bg-white/76 p-3 shadow-[0_18px_50px_rgba(20,20,20,0.12)] backdrop-blur-2xl">
            {heroNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-extrabold text-[#151515] hover:bg-white/62"
              >
                {item.label}
                <ChevronRight className="size-4 text-[#B94A2F]" aria-hidden="true" />
              </a>
            ))}
            <Link
              href={bookingPath}
              className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-extrabold text-white"
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
