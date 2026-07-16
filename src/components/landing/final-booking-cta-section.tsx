"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CalendarDays,
  Clock3,
  Heart,
  MessageCircle,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { clsx } from "clsx";

export type FinalCTAImageData = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition: string;
  priority: boolean;
};

type FinalBookingCTASectionProps = {
  bookingPath: string;
  frauncesClassName: string;
  nunitoClassName: string;
  whatsappPhone: string;
  image?: FinalCTAImageData;
};

type FinalCTABenefit = {
  id: "scheduled-service" | "personalized-care" | "attention-to-detail";
  icon: LucideIcon;
  text: string;
};

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const defaultFinalCTAImage: FinalCTAImageData = {
  src: `${publicBasePath}/images/moments/brides.webp`,
  alt: "Penteado de noiva sendo finalizado com cuidado e atenção aos detalhes.",
  width: 1024,
  height: 1536,
  objectPosition: "50% 34%",
  priority: false,
};

const finalCTABenefits: FinalCTABenefit[] = [
  {
    id: "scheduled-service",
    icon: Clock3,
    text: "Atendimento com hora marcada",
  },
  {
    id: "personalized-care",
    icon: UserRound,
    text: "Cuidado personalizado",
  },
  {
    id: "attention-to-detail",
    icon: Heart,
    text: "Atenção aos detalhes",
  },
];

function buildWhatsAppHref(phone: string) {
  const message =
    "Olá, Késia! Gostaria de conversar sobre um horário para o meu atendimento.";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function FinalBookingCTASection({
  bookingPath,
  frauncesClassName,
  nunitoClassName,
  whatsappPhone,
  image = defaultFinalCTAImage,
}: FinalBookingCTASectionProps) {
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
        const eyebrow = select<HTMLElement>("[data-final-cta-eyebrow]");
        const headlineLines = select<HTMLElement>("[data-final-cta-headline-line]");
        const supporting = select<HTMLElement>("[data-final-cta-supporting]");
        const benefits = select<HTMLElement>("[data-final-cta-benefit]");
        const actions = select<HTMLElement>("[data-final-cta-action]");
        const imageFrame = select<HTMLElement>("[data-final-cta-image-frame]");

        gsap.set(eyebrow, { autoAlpha: 0, y: 14 });
        gsap.set(headlineLines, { autoAlpha: 0, yPercent: 105 });
        gsap.set(supporting, { autoAlpha: 0, y: 18 });
        gsap.set(benefits, { autoAlpha: 0, y: 16 });
        gsap.set(actions, { autoAlpha: 0, y: 14, scale: 0.99 });
        gsap.set(imageFrame, {
          autoAlpha: 0,
          x: 28,
          scale: 1.025,
          clipPath: "inset(0% 0% 0% 8% round 22px)",
        });

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              once: true,
            },
          })
          .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.62 }, 0)
          .to(
            headlineLines,
            { autoAlpha: 1, yPercent: 0, duration: 0.94, stagger: 0.1 },
            0.08,
          )
          .to(supporting, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.4)
          .to(benefits, { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.1 }, 0.52)
          .to(actions, { autoAlpha: 1, y: 0, scale: 1, duration: 0.62, stagger: 0.08 }, 0.68)
          .to(
            imageFrame,
            {
              autoAlpha: 1,
              x: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0% round 22px)",
              duration: 1.08,
            },
            0.2,
          );
      });

      media.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            select<HTMLElement>("[data-final-cta-image-parallax]"),
            { y: -10 },
            {
              y: 10,
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
        document.body.classList.toggle("final-cta-section-visible", entry.isIntersecting);
      },
      { threshold: 0 },
    );

    visibilityObserver.observe(section);

    return () => {
      visibilityObserver.disconnect();
      document.body.classList.remove("final-cta-section-visible");
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cta-final"
      aria-labelledby="cta-final-titulo"
      className={clsx(
        nunitoClassName,
        "relative overflow-clip bg-[#FBF8F3] px-6 py-[88px] text-[#281F1A] max-[359px]:px-5 md:px-10 md:py-[110px] xl:px-[clamp(48px,5vw,88px)] xl:py-[clamp(110px,9vw,174px)]",
      )}
    >
      <div className="final-booking-cta-grid mx-auto max-w-[1720px]">
        <FinalCTAContent
          bookingPath={bookingPath}
          frauncesClassName={frauncesClassName}
          whatsappHref={whatsappHref}
        />
        <FinalCTAImage image={image} />
      </div>
    </section>
  );
}

function FinalCTAContent({
  bookingPath,
  frauncesClassName,
  whatsappHref,
}: {
  bookingPath: string;
  frauncesClassName: string;
  whatsappHref: string;
}) {
  return (
    <div className="max-w-[720px]">
      <div
        data-final-cta-eyebrow
        className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[#DDA88F] px-5 text-xs font-extrabold uppercase text-[#B64F31]"
      >
        <Sparkles className="size-4" aria-hidden="true" />
        <span>Seu momento</span>
      </div>

      <h2
        id="cta-final-titulo"
        aria-label="O seu grande momento merece começar com calma."
        className={clsx(
          frauncesClassName,
          "mt-8 text-[28px] font-normal leading-[0.97] tracking-normal text-[#281F1A] min-[360px]:text-[32px] sm:text-[60px] lg:text-[70px] xl:text-[58px] 2xl:text-[68px]",
        )}
      >
        <span className="block overflow-hidden pb-1">
          <span data-final-cta-headline-line className="block">O seu grande</span>
        </span>
        <span className="block overflow-hidden pb-1">
          <span data-final-cta-headline-line className="block">momento merece</span>
        </span>
        <span className="block overflow-hidden pb-1">
          <span data-final-cta-headline-line className="block">começar com calma.</span>
        </span>
      </h2>

      <p
        data-final-cta-supporting
        className="mt-7 max-w-[590px] text-base font-semibold leading-7 text-[#746A62] sm:text-lg sm:leading-8"
      >
        Escolha seu horário e viva um atendimento pensado para valorizar seu estilo,
        sua ocasião e a sua história.
      </p>

      <FinalCTABenefits />

      <div className="mt-10 flex flex-col items-start gap-5">
        <Link
          data-final-cta-action
          href={bookingPath}
          className="group inline-flex min-h-[60px] w-full max-w-[480px] items-center justify-center gap-3 rounded-md bg-[#C95C37] px-8 text-base font-extrabold text-white shadow-[0_14px_30px_rgba(111,59,38,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#AE492B] hover:shadow-[0_18px_38px_rgba(111,59,38,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#AE492B] active:translate-y-0 active:scale-[0.985]"
        >
          <CalendarDays className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          Escolher meu horário
        </Link>

        <a
          data-final-cta-action
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex min-h-11 items-center gap-2.5 text-sm font-bold text-[#77685F] underline decoration-[#CBA38D] underline-offset-[7px] transition-colors hover:text-[#9D422A] hover:decoration-[#9D422A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3593D]"
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

function FinalCTABenefits() {
  return (
    <ul className="final-cta-benefits mt-9" aria-label="Diferenciais do atendimento">
      {finalCTABenefits.map((benefit) => {
        const Icon = benefit.icon;
        return (
          <li key={benefit.id} data-final-cta-benefit className="final-cta-benefit-item group">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#F3E9DF] text-[#C15B39] transition duration-500 group-hover:-translate-y-0.5 group-hover:text-[#A8462B]">
              <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
            </span>
            <span className="text-sm font-bold leading-6 text-[#66574F]">
              {benefit.text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function FinalCTAImage({ image }: { image: FinalCTAImageData }) {
  return (
    <figure
      data-final-cta-image-frame
      className="final-cta-image-frame group"
    >
      <div data-final-cta-image-parallax className="absolute -inset-3">
        <div className="relative size-full transition-transform duration-700 ease-out group-hover:scale-[1.012]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={image.priority}
            sizes="(min-width: 1100px) 50vw, (min-width: 768px) 86vw, 100vw"
            className="object-cover"
            style={{ objectPosition: image.objectPosition }}
          />
        </div>
      </div>
    </figure>
  );
}
