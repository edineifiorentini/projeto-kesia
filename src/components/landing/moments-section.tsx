"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { PremiumAction } from "@/components/ui/premium-action";

type MomentsSectionProps = {
  frauncesClassName: string;
  nunitoClassName: string;
  whatsappPhone: string;
};

type MomentItem = {
  id: "brides" | "debutantes" | "events";
  label: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    position: string;
  };
};

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const momentItems: MomentItem[] = [
  {
    id: "brides",
    label: "Noivas",
    title: "Segurança para viver o grande dia",
    description: "Um penteado que te acompanha em cada emoção.",
    image: {
      src: `${publicBasePath}/images/moments/brides.webp`,
      alt: "Noiva de perfil com penteado preso elegante e acabamento delicado.",
      width: 1024,
      height: 1536,
      position: "50% 42%",
    },
  },
  {
    id: "debutantes",
    label: "Debutantes",
    title: "Personalidade para celebrar uma nova fase",
    description: "Seu estilo, realçado com leveza e autenticidade.",
    image: {
      src: `${publicBasePath}/images/moments/debutantes.webp`,
      alt: "Debutante com penteado elegante, jovem e personalizado.",
      width: 1024,
      height: 1536,
      position: "50% 40%",
    },
  },
  {
    id: "events",
    label: "Festas e eventos",
    title: "Presença para momentos especiais",
    description: "Beleza que destaca quem você é e como deseja ser lembrada.",
    image: {
      src: `${publicBasePath}/images/moments/events.webp`,
      alt: "Mulher com penteado sofisticado para festa ou evento especial.",
      width: 1024,
      height: 1536,
      position: "50% 42%",
    },
  },
];

const parallaxRanges = [
  { from: 18, to: -18 },
  { from: 26, to: -22 },
  { from: 14, to: -20 },
] as const;

function whatsappHref(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function MomentsSection({
  frauncesClassName,
  nunitoClassName,
  whatsappPhone,
}: MomentsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const select = gsap.utils.selector(section);

      media.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const eyebrow = select<HTMLElement>("[data-moments-eyebrow]");
          const eyebrowLine = select<HTMLElement>("[data-moments-eyebrow-line]");
          const headlineLines = select<HTMLElement>("[data-moments-headline-line]");
          const supporting = select<HTMLElement>("[data-moments-supporting]");
          const panels = select<HTMLElement>("[data-moment-panel]");
          const panelContent = select<HTMLElement>("[data-moment-content]");
          const parallaxLayers = select<HTMLElement>("[data-moment-parallax]");
          const cta = select<HTMLElement>("[data-moments-cta]");

          gsap.set(eyebrow, { autoAlpha: 0, y: 16 });
          gsap.set(eyebrowLine, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(headlineLines, { autoAlpha: 0, yPercent: 105 });
          gsap.set(supporting, { autoAlpha: 0, y: 18 });
          gsap.set(panels, {
            autoAlpha: 0,
            y: 52,
            scale: 0.985,
            clipPath: "inset(14% 0% 0% 0% round 16px)",
          });
          gsap.set(panelContent, { autoAlpha: 0, y: 20 });
          gsap.set(cta, { autoAlpha: 0, y: 18, scale: 0.98 });

          const entrance = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              once: true,
            },
          });

          entrance
            .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.65 }, 0)
            .to(eyebrowLine, { scaleX: 1, duration: 0.65 }, 0.08)
            .to(
              headlineLines,
              {
                autoAlpha: 1,
                yPercent: 0,
                duration: 0.92,
                stagger: 0.11,
              },
              0.12,
            )
            .to(supporting, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.55)
            .to(
              panels,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                clipPath: "inset(0% 0% 0% 0% round 16px)",
                duration: 0.95,
                stagger: 0.13,
              },
              0.5,
            )
            .to(
              panelContent,
              { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.13 },
              0.76,
            )
            .to(cta, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 }, 1.04);

          parallaxLayers.forEach((layer, index) => {
            const panel = panels[index];
            const range = parallaxRanges[index] ?? parallaxRanges[0];

            gsap.fromTo(
              layer,
              { y: range.from },
              {
                y: range.to,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
        },
      );

      media.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          const introItems = select<HTMLElement>("[data-moments-mobile-intro]");
          const panels = select<HTMLElement>("[data-moment-panel]");
          const cta = select<HTMLElement>("[data-moments-cta]");

          gsap.set(introItems, { autoAlpha: 0, y: 22 });
          gsap.set(panels, { autoAlpha: 0, y: 34 });
          gsap.set(cta, { autoAlpha: 0, y: 20 });

          gsap.to(introItems, {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 86%",
              once: true,
            },
          });

          panels.forEach((panel) => {
            gsap.to(panel, {
              autoAlpha: 1,
              y: 0,
              duration: 0.78,
              ease: "power3.out",
              scrollTrigger: {
                trigger: panel,
                start: "top 88%",
                once: true,
              },
            });
          });

          gsap.to(cta, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cta,
              start: "top 92%",
              once: true,
            },
          });
        },
      );
    }, section);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="momentos"
      role="region"
      aria-labelledby="momentos-titulo"
      className={clsx(
        nunitoClassName,
        "relative overflow-clip bg-[var(--color-surface)] px-6 py-[92px] text-[var(--color-text-strong)] md:px-10 md:py-[110px] min-[1200px]:px-[clamp(48px,5vw,88px)] min-[1200px]:py-[clamp(110px,9vw,180px)]",
      )}
    >
      <div className="mx-auto max-w-[1640px]">
        <header className="max-w-[1120px]">
          <div
            data-moments-eyebrow
            data-moments-mobile-intro
            className="flex items-center gap-3 text-[0.72rem] font-extrabold uppercase leading-4 tracking-[0.22em] text-[var(--color-brand-primary)]"
          >
            <Sparkles className="size-4 shrink-0" aria-hidden="true" />
            <span>Para cada momento</span>
            <span
              data-moments-eyebrow-line
              aria-hidden="true"
              className="h-px w-12 bg-[var(--color-brand-primary)]/60"
            />
          </div>

          <h2
            id="momentos-titulo"
            data-moments-mobile-intro
            className={clsx(
              frauncesClassName,
              "mt-6 text-[clamp(3rem,10.5vw,4.5rem)] font-normal leading-[0.96] tracking-normal min-[900px]:text-[clamp(3.8rem,4.5vw,5.9rem)]",
            )}
          >
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-moments-headline-line className="block">
                Cada história pede uma
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.09em]">
              <span data-moments-headline-line className="block">
                beleza que <em className="font-normal text-[var(--color-text)]">faça sentido para você.</em>
              </span>
            </span>
          </h2>

          <p
            data-moments-supporting
            data-moments-mobile-intro
            className="mt-5 max-w-[610px] text-[1rem] font-semibold leading-7 text-[var(--color-text-muted)] md:text-[1.08rem]"
          >
            Mais do que escolher um penteado, é sobre encontrar o estilo que representa seu momento.
          </p>
        </header>

        <div
          data-moments-triptych
          data-active={activeIndex ?? "none"}
          className="moments-triptych mt-[clamp(46px,5vw,74px)] grid gap-[clamp(14px,1.4vw,24px)] md:grid-cols-2 min-[1100px]:grid-cols-3"
        >
          {momentItems.map((moment, index) => {
            const isActive = activeIndex === index;

            return (
              <article
                key={moment.id}
                tabIndex={0}
                role="group"
                aria-labelledby={`momento-${moment.id}-titulo`}
                data-moment-panel
                data-active={isActive ? "true" : "false"}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={(event) => {
                  if (document.activeElement !== event.currentTarget) {
                    setActiveIndex(null);
                  }
                }}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                className={clsx(
                  "moment-panel group relative isolate min-h-[480px] min-w-0 overflow-hidden rounded-[16px] bg-[var(--color-background-alt)] shadow-[var(--shadow-soft)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-surface)] md:min-h-[520px]",
                )}
              >
                <div
                  data-moment-parallax
                  className="absolute -inset-9 will-change-transform"
                >
                  <Image
                    src={moment.image.src}
                    alt={moment.image.alt}
                    width={moment.image.width}
                    height={moment.image.height}
                    sizes="(min-width: 1100px) 34vw, (min-width: 768px) 50vw, 100vw"
                    quality={92}
                    loading="lazy"
                    className="moment-panel-image h-full w-full object-cover"
                    style={{ objectPosition: moment.image.position }}
                  />
                </div>

                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-[1] bg-[var(--gradient-image-overlay)]"
                />

                <div
                  data-moment-content
                  className="moment-panel-content absolute inset-x-[clamp(22px,2.2vw,36px)] bottom-[clamp(24px,2.6vw,42px)] z-[2] max-w-[360px] text-[var(--color-surface)]"
                >
                  <p className="text-[0.76rem] font-extrabold uppercase leading-4 tracking-[0.1em] text-[var(--color-surface)]/95">
                    {moment.label}
                  </p>
                  <span
                    aria-hidden="true"
                    className="moment-panel-line mt-3 block h-px w-7 bg-[var(--color-surface)]/75"
                  />
                  <h3
                    id={`momento-${moment.id}-titulo`}
                    className={clsx(
                      frauncesClassName,
                      "moment-panel-title mt-3 text-[clamp(1.8rem,2.1vw,2.65rem)] font-normal leading-[1.04] tracking-normal",
                    )}
                  >
                    {moment.title}
                  </h3>
                  <p className="moment-panel-description mt-3 max-w-[320px] text-[0.9rem] font-semibold leading-6 text-[var(--color-surface)]/85">
                    {moment.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div data-moments-cta className="mt-[clamp(34px,4vw,58px)] flex justify-center">
          <PremiumAction asChild size="md">
            <a
              href={whatsappHref(
                whatsappPhone,
                "Olá, Késia! Gostaria de conversar sobre o penteado para o meu momento especial.",
              )}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle data-premium-leading aria-hidden="true" />
              <span>Conversar sobre meu momento</span>
              <ArrowRight data-premium-arrow aria-hidden="true" />
            </a>
          </PremiumAction>
        </div>
      </div>
    </section>
  );
}
