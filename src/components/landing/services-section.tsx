"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle, Plus, Sparkles } from "lucide-react";
import { clsx } from "clsx";

type ServicesSectionProps = {
  frauncesClassName: string;
  nunitoClassName: string;
  whatsappPhone: string;
};

type ServiceShowcaseItem = {
  id:
    | "bridal-hairstyles"
    | "debutante-hairstyles"
    | "party-hairstyles"
    | "hair-coloring"
    | "wash-and-brush"
    | "custom-finishing";
  number: string;
  title: string;
  description: string;
  caption: string;
  whatsappMessage: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    position: string;
  };
};

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const serviceShowcaseItems: ServiceShowcaseItem[] = [
  {
    id: "bridal-hairstyles",
    number: "01",
    title: "Penteados para noivas",
    description:
      "Criações personalizadas para harmonizar com você, seu vestido e a atmosfera do grande dia.",
    caption: "Criação personalizada",
    whatsappMessage:
      "Olá, Késia! Gostaria de saber mais sobre penteados para noivas.",
    image: {
      src: `${publicBasePath}/images/services/bridal-hairstyle.webp`,
      alt: "Noiva de perfil com coque baixo e acessório delicado.",
      width: 1024,
      height: 1536,
      position: "50% 42%",
    },
  },
  {
    id: "debutante-hairstyles",
    number: "02",
    title: "Penteados para debutantes",
    description:
      "Uma produção jovem, elegante e marcante para celebrar um momento inesquecível.",
    caption: "Elegância para celebrar",
    whatsappMessage:
      "Olá, Késia! Gostaria de saber mais sobre penteados para debutantes.",
    image: {
      src: `${publicBasePath}/images/services/debutante-hairstyle.webp`,
      alt: "Debutante com penteado semipreso e ondas delicadas.",
      width: 1024,
      height: 1536,
      position: "50% 40%",
    },
  },
  {
    id: "party-hairstyles",
    number: "03",
    title: "Penteados para festas",
    description:
      "Finalizações sofisticadas para formaturas, aniversários e celebrações especiais.",
    caption: "Beleza para momentos especiais",
    whatsappMessage:
      "Olá, Késia! Gostaria de saber mais sobre penteados para festas.",
    image: {
      src: `${publicBasePath}/images/services/party-hairstyle.webp`,
      alt: "Mulher com ondas polidas em penteado elegante para festa.",
      width: 1024,
      height: 1536,
      position: "50% 42%",
    },
  },
  {
    id: "hair-coloring",
    number: "04",
    title: "Coloração",
    description:
      "Tons e transformações pensados para valorizar sua pele, seu cabelo e sua identidade.",
    caption: "Cor que valoriza sua essência",
    whatsappMessage:
      "Olá, Késia! Gostaria de saber mais sobre o serviço de coloração.",
    image: {
      src: `${publicBasePath}/images/services/hair-coloring.webp`,
      alt: "Cabelo longo com coloração castanha e nuances caramelo.",
      width: 1024,
      height: 1536,
      position: "50% 45%",
    },
  },
  {
    id: "wash-and-brush",
    number: "05",
    title: "Lavagem e escova",
    description:
      "Cuidado, brilho e movimento para deixar os fios leves, alinhados e bem finalizados.",
    caption: "Cuidado, brilho e movimento",
    whatsappMessage:
      "Olá, Késia! Gostaria de saber mais sobre lavagem e escova.",
    image: {
      src: `${publicBasePath}/images/services/wash-and-brush.webp`,
      alt: "Cabelo saudável e alinhado depois de uma escova profissional.",
      width: 1024,
      height: 1536,
      position: "50% 44%",
    },
  },
  {
    id: "custom-finishing",
    number: "06",
    title: "Finalização personalizada",
    description:
      "Ondas, modelagem e acabamento para valorizar o movimento natural dos fios.",
    caption: "Acabamento pensado para você",
    whatsappMessage:
      "Olá, Késia! Gostaria de saber mais sobre finalização personalizada.",
    image: {
      src: `${publicBasePath}/images/services/custom-finishing.webp`,
      alt: "Cabelo longo com ondas e finalização personalizada.",
      width: 1024,
      height: 1536,
      position: "50% 45%",
    },
  },
];

function whatsappHref(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function ServicesSection({
  frauncesClassName,
  nunitoClassName,
  whatsappPhone,
}: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = serviceShowcaseItems[activeIndex];

  const updateActiveService = (nextIndex: number) => {
    if (activeIndexRef.current === nextIndex) {
      return;
    }

    activeIndexRef.current = nextIndex;
    startTransition(() => setActiveIndex(nextIndex));
  };

  const selectService = (nextIndex: number) => {
    updateActiveService(nextIndex);

    const section = sectionRef.current;
    if (
      !section ||
      !window.matchMedia(
        "(min-width: 1100px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)",
      ).matches
    ) {
      return;
    }

    const scrollRange = Math.max(0, section.offsetHeight - window.innerHeight);
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const progress = nextIndex / (serviceShowcaseItems.length - 1);

    window.scrollTo({
      top: sectionTop + scrollRange * progress,
      behavior: "auto",
    });
  };

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
        "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        () => {
          const eyebrow = select<HTMLElement>("[data-services-eyebrow]");
          const eyebrowLine = select<HTMLElement>("[data-services-eyebrow-line]");
          const headlineLines = select<HTMLElement>("[data-services-headline-line]");
          const supporting = select<HTMLElement>("[data-services-supporting]");
          const cta = select<HTMLElement>("[data-services-cta]");
          const selector = select<HTMLElement>("[data-services-selector]");
          const mediaPanel = select<HTMLElement>("[data-services-media]");

          gsap.set(eyebrow, { autoAlpha: 0, y: 16 });
          gsap.set(eyebrowLine, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(headlineLines, { yPercent: 108 });
          gsap.set(supporting, { autoAlpha: 0, y: 18 });
          gsap.set(cta, { autoAlpha: 0, y: 14 });
          gsap.set(selector, { autoAlpha: 0, y: 22 });
          gsap.set(mediaPanel, { autoAlpha: 0, y: 28, scale: 0.99 });

          const reveal = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              once: true,
            },
          });

          reveal
            .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.28 }, 0)
            .to(eyebrowLine, { scaleX: 1, duration: 0.32 }, 0)
            .to(
              headlineLines,
              { yPercent: 0, duration: 0.42, stagger: 0.045 },
              0.08,
            )
            .to(supporting, { autoAlpha: 1, y: 0, duration: 0.34 }, 0.24)
            .to(cta, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.3)
            .to(selector, { autoAlpha: 1, y: 0, duration: 0.42 }, 0.32)
            .to(
              mediaPanel,
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 },
              0.22,
            );

          return () => reveal.kill();
        },
      );

      media.add(
        "(min-width: 1100px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)",
        () => {
          const serviceScroll = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const nextIndex = Math.min(
                serviceShowcaseItems.length - 1,
                Math.floor(self.progress * serviceShowcaseItems.length),
              );
              updateActiveService(nextIndex);
            },
          });

          return () => serviceScroll.kill();
        },
      );

      media.add(
        "(max-width: 899px) and (prefers-reduced-motion: no-preference)",
        () => {
          const revealNodes = select<HTMLElement>("[data-services-mobile-reveal]");
          const animations = revealNodes.map((node) =>
            gsap.fromTo(
              node,
              { autoAlpha: 0, y: 20 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
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
      id="servicos"
      aria-labelledby="servicos-titulo"
      className={clsx(
        nunitoClassName,
        "services-scroll relative overflow-clip bg-[#FBFAF8] text-[#1D1A18]",
      )}
    >
      <div className="services-sticky px-6 py-24 sm:px-8 min-[900px]:px-[clamp(32px,5vw,88px)] min-[900px]:py-[clamp(56px,7vw,112px)]">
        <div className="services-layout relative mx-auto max-w-[1680px] min-[900px]:grid min-[900px]:grid-cols-[minmax(340px,0.78fr)_minmax(430px,1.22fr)] min-[900px]:grid-rows-[auto_minmax(0,1fr)] min-[900px]:gap-x-[clamp(48px,7vw,130px)]">
          <ServiceIntroduction
            activeService={activeService}
            frauncesClassName={frauncesClassName}
            whatsappPhone={whatsappPhone}
          />

          <DesktopServiceSelector
            activeIndex={activeIndex}
            frauncesClassName={frauncesClassName}
            onPreview={updateActiveService}
            onSelect={selectService}
          />

          <ActiveServiceMedia
            activeIndex={activeIndex}
            frauncesClassName={frauncesClassName}
          />

          <MobileServiceAccordion
            activeIndex={activeIndex}
            frauncesClassName={frauncesClassName}
            whatsappPhone={whatsappPhone}
            onSelect={selectService}
          />
        </div>
      </div>
    </section>
  );
}

function ServiceIntroduction({
  activeService,
  frauncesClassName,
  whatsappPhone,
}: {
  activeService: ServiceShowcaseItem;
  frauncesClassName: string;
  whatsappPhone: string;
}) {
  return (
    <div
      data-services-introduction
      className="min-[900px]:col-start-1 min-[900px]:row-start-1"
    >
      <div
        data-services-eyebrow
        data-services-mobile-reveal
        className="flex items-center gap-3 text-[0.7rem] font-extrabold uppercase leading-4 tracking-[0.24em] text-[#9A7E60]"
      >
        <Sparkles className="size-4 shrink-0" aria-hidden="true" />
        <span>Serviços</span>
        <span
          data-services-eyebrow-line
          aria-hidden="true"
          className="h-px w-12 bg-[#B1845F]/65"
        />
      </div>

      <h2
        id="servicos-titulo"
        data-services-headline
        className={clsx(
          frauncesClassName,
          "mt-6 text-[clamp(2.75rem,11vw,4rem)] font-normal leading-[0.95] tracking-normal min-[900px]:text-[clamp(2.8rem,3.6vw,4.8rem)]",
        )}
      >
        {["Beleza pensada para", "cada momento da", "sua história."].map(
          (line) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span
                data-services-headline-line
                data-services-mobile-reveal
                className={clsx(
                  "block",
                  line === "sua história." && "text-[#A58162]",
                )}
              >
                {line}
              </span>
            </span>
          ),
        )}
      </h2>

      <p
        data-services-supporting
        data-services-mobile-reveal
        className="mt-5 max-w-[500px] text-base font-semibold leading-7 text-[#716B66] min-[900px]:text-[0.95rem]"
      >
        Do grande dia aos cuidados cotidianos, cada serviço respeita seu estilo e
        sua essência.
      </p>

      <a
        data-services-cta
        href={whatsappHref(whatsappPhone, activeService.whatsappMessage)}
        target="_blank"
        rel="noreferrer"
        className="mt-6 hidden min-h-12 items-center justify-center gap-2 rounded-md bg-[#B1845F] px-5 text-sm font-extrabold text-white transition duration-300 hover:bg-[#9E7251] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#9E7251] min-[900px]:inline-flex"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        Conversar sobre este serviço
      </a>
    </div>
  );
}

function DesktopServiceSelector({
  activeIndex,
  frauncesClassName,
  onPreview,
  onSelect,
}: {
  activeIndex: number;
  frauncesClassName: string;
  onPreview: (index: number) => void;
  onSelect: (index: number) => void;
}) {
  return (
    <ol
      data-services-selector
      className="mt-7 hidden min-h-0 min-[900px]:col-start-1 min-[900px]:row-start-2 min-[900px]:block"
      aria-label="Selecione um serviço"
    >
      {serviceShowcaseItems.map((service, index) => {
        const isActive = index === activeIndex;

        return (
          <li
            key={service.id}
            className="border-t border-[rgba(91,69,52,0.15)] last:border-b"
          >
            <button
              type="button"
              aria-pressed={isActive}
              aria-controls="servico-imagem-ativa"
              onMouseEnter={() => onPreview(index)}
              onClick={() => onSelect(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(index);
                }
              }}
              className={clsx(
                "group grid w-full grid-cols-[60px_1px_minmax(0,1fr)_28px] items-center gap-x-4 py-2 text-left transition-[opacity,padding] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#B1845F] min-[1280px]:grid-cols-[72px_1px_minmax(0,1fr)_28px]",
                isActive ? "py-3 opacity-100" : "opacity-65 hover:opacity-90",
              )}
            >
              <span
                className={clsx(
                  frauncesClassName,
                  "text-[clamp(1.75rem,2vw,2.45rem)] font-normal leading-none tracking-normal text-[#B1845F] transition duration-300",
                  isActive && "text-[clamp(2.2rem,2.7vw,3.35rem)]",
                )}
                aria-hidden="true"
              >
                {service.number}
              </span>
              <span
                aria-hidden="true"
                className="h-full min-h-10 w-px bg-[rgba(91,69,52,0.18)]"
              />
              <span className="block min-w-0">
                <span
                  className={clsx(
                    frauncesClassName,
                    "block text-[clamp(1.2rem,1.4vw,1.6rem)] font-normal leading-[1.12] tracking-normal text-[#4B4540] transition-colors duration-300",
                    isActive && "text-[clamp(1.4rem,1.7vw,1.9rem)] text-[#1D1A18]",
                  )}
                >
                  {service.title}
                </span>
                <span
                  className={clsx(
                    "grid transition-[grid-template-rows,opacity] duration-300",
                    isActive
                      ? "mt-2 grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <span className="min-h-0 overflow-hidden text-[0.82rem] font-semibold leading-5 text-[#716B66]">
                    {service.description}
                  </span>
                </span>
              </span>
              <span className="grid size-7 place-items-center text-[#A58162]" aria-hidden="true">
                {isActive ? (
                  <Sparkles className="size-4" />
                ) : (
                  <Plus className="size-4 transition-transform duration-300 group-hover:rotate-90" />
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function ActiveServiceMedia({
  activeIndex,
  frauncesClassName,
}: {
  activeIndex: number;
  frauncesClassName: string;
}) {
  const activeService = serviceShowcaseItems[activeIndex];
  const progress = ((activeIndex + 1) / serviceShowcaseItems.length) * 100;

  return (
    <figure
      id="servico-imagem-ativa"
      data-services-media
      className="services-media hidden min-h-[590px] overflow-hidden rounded-[16px] bg-[#F5F0E9] min-[900px]:col-start-2 min-[900px]:row-span-2 min-[900px]:row-start-1 min-[900px]:grid min-[900px]:grid-rows-[minmax(0,1fr)_auto]"
      aria-live="polite"
    >
      <div className="relative min-h-0 overflow-hidden bg-[#EFE7DE]">
        {serviceShowcaseItems.map((service, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={service.id}
              data-service-image={service.id}
              aria-hidden={!isActive}
              className={clsx(
                "absolute inset-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isActive
                  ? "z-10 scale-100 opacity-100"
                  : "pointer-events-none z-0 scale-[1.015] opacity-0",
              )}
            >
              <Image
                src={service.image.src}
                alt={isActive ? service.image.alt : ""}
                width={service.image.width}
                height={service.image.height}
                sizes="(min-width: 1400px) 56vw, (min-width: 900px) 58vw, 100vw"
                quality={92}
                loading={index < 2 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
                style={{ objectPosition: service.image.position }}
              />
            </div>
          );
        })}
      </div>

      <figcaption className="grid grid-cols-[auto_minmax(70px,1fr)_minmax(150px,auto)] items-center gap-5 bg-[#F7F2EC] px-6 py-5 min-[1280px]:gap-8 min-[1280px]:px-8">
        <div className="flex items-end gap-2 text-[#A58162]">
          <span className={clsx(frauncesClassName, "text-3xl leading-none")}>
            {activeService.number}
          </span>
          <span className="pb-0.5 text-xs font-bold text-[#716B66]">
            / {String(serviceShowcaseItems.length).padStart(2, "0")}
          </span>
        </div>

        <div
          role="progressbar"
          aria-label="Progresso dos serviços"
          aria-valuemin={1}
          aria-valuemax={serviceShowcaseItems.length}
          aria-valuenow={activeIndex + 1}
          className="h-px overflow-hidden bg-[#DCCFC1]"
        >
          <span
            className="block h-full bg-[#B1845F] transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-right">
          <p className="text-[0.68rem] font-extrabold uppercase leading-4 tracking-[0.18em] text-[#9A6E4C]">
            {activeService.title}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#716B66]">
            {activeService.caption}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

function MobileServiceAccordion({
  activeIndex,
  frauncesClassName,
  whatsappPhone,
  onSelect,
}: {
  activeIndex: number;
  frauncesClassName: string;
  whatsappPhone: string;
  onSelect: (index: number) => void;
}) {
  return (
    <ol className="mt-12 min-[900px]:hidden" aria-label="Serviços disponíveis">
      {serviceShowcaseItems.map((service, index) => {
        const isActive = index === activeIndex;
        const panelId = `servico-painel-${service.id}`;

        return (
          <li
            key={service.id}
            data-services-mobile-reveal
            className="border-t border-[rgba(91,69,52,0.16)] last:border-b"
          >
            <button
              type="button"
              aria-expanded={isActive}
              aria-controls={panelId}
              onClick={() => onSelect(index)}
              className="grid min-h-16 w-full grid-cols-[48px_1px_minmax(0,1fr)_28px] items-center gap-x-4 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#B1845F]"
            >
              <span
                className={clsx(
                  frauncesClassName,
                  "text-[1.75rem] leading-none text-[#B1845F]",
                )}
                aria-hidden="true"
              >
                {service.number}
              </span>
              <span aria-hidden="true" className="h-10 w-px bg-[#DCCFC1]" />
              <span
                className={clsx(
                  frauncesClassName,
                  "text-[1.35rem] font-normal leading-[1.1] tracking-normal",
                )}
              >
                {service.title}
              </span>
              <Plus
                className={clsx(
                  "size-5 text-[#A58162] transition-transform duration-300",
                  isActive && "rotate-45",
                )}
                aria-hidden="true"
              />
            </button>

            <div
              id={panelId}
              aria-hidden={!isActive}
              className={clsx(
                "grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isActive
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="pb-5 pl-16 text-[0.95rem] font-semibold leading-6 text-[#716B66]">
                  {service.description}
                </p>
                <figure className="overflow-hidden rounded-[12px] bg-[#F5F0E9]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={service.image.src}
                      alt={service.image.alt}
                      width={service.image.width}
                      height={service.image.height}
                      sizes="calc(100vw - 48px)"
                      quality={92}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      style={{ objectPosition: service.image.position }}
                    />
                  </div>
                  <figcaption className="flex items-center justify-between gap-4 bg-[#F7F2EC] px-4 py-4">
                    <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9A6E4C]">
                      {service.caption}
                    </span>
                    <span className="text-xs font-bold text-[#716B66]">
                      {service.number} / 06
                    </span>
                  </figcaption>
                </figure>
                <a
                  href={whatsappHref(whatsappPhone, service.whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={isActive ? 0 : -1}
                  className="mb-7 mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-[#B1845F] px-4 text-sm font-extrabold text-[#8C6546] transition-colors hover:bg-[#F5F0E9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#B1845F]"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Conversar sobre este serviço
                </a>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
