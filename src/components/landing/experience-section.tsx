"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles } from "lucide-react";
import { clsx } from "clsx";

type ExperienceSectionProps = {
  frauncesClassName: string;
  nunitoClassName: string;
};

type ExperienceFeature = {
  number: string;
  title: string;
  description: string;
};

type ExperienceImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  focalPosition: string;
  caption?: string;
};

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const experienceFeatures: ExperienceFeature[] = [
  {
    number: "01",
    title: "Atendimento personalizado",
    description:
      "Cada detalhe é pensado para combinar com você, seu vestido e seu momento.",
  },
  {
    number: "02",
    title: "Leveza e acolhimento",
    description:
      "Um processo tranquilo para você se sentir segura do início ao fim.",
  },
  {
    number: "03",
    title: "Resultado memorável",
    description:
      "Penteados criados para valorizar sua beleza com elegância e naturalidade.",
  },
];

const experienceImages: ExperienceImage[] = [
  {
    src: `${publicBasePath}/images/experience/noiva-coque-editorial.webp`,
    alt: "Noiva de perfil com penteado preso baixo e acabamento natural.",
    width: 876,
    height: 1796,
    focalPosition: "50% 38%",
    caption: "Coque baixo texturizado",
  },
  {
    src: `${publicBasePath}/images/experience/noiva-semi-preso-lateral.webp`,
    alt: "Detalhe lateral de penteado semi-preso para noiva com flores delicadas.",
    width: 1200,
    height: 900,
    focalPosition: "52% 44%",
    caption: "Semi-preso com ondas",
  },
  {
    src: `${publicBasePath}/images/experience/noiva-coque-trancado.webp`,
    alt: "Vista posterior de coque baixo trançado com acessório floral.",
    width: 1100,
    height: 1100,
    focalPosition: "50% 48%",
    caption: "Coque trançado",
  },
];

export function ExperienceSection({
  frauncesClassName,
  nunitoClassName,
}: ExperienceSectionProps) {
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
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const eyebrow = select<HTMLElement>("[data-experience-eyebrow]");
          const eyebrowLine = select<HTMLElement>("[data-experience-eyebrow-line]");
          const headlineLines = select<HTMLElement>("[data-experience-headline-line]");
          const supporting = select<HTMLElement>("[data-experience-supporting]");
          const imageFrames = select<HTMLElement>("[data-experience-frame]");
          const imageMedia = select<HTMLElement>("[data-experience-media]");
          const mainParallax = select<HTMLElement>("[data-experience-parallax='main']");
          const upperParallax = select<HTMLElement>("[data-experience-parallax='upper']");
          const lowerParallax = select<HTMLElement>("[data-experience-parallax='lower']");
          const featureDividers = select<HTMLElement>("[data-experience-divider]");
          const featureNumbers = select<HTMLElement>("[data-experience-number]");
          const featureContent = select<HTMLElement>("[data-experience-feature-content]");

          gsap.set(eyebrow, { autoAlpha: 0, y: 18 });
          gsap.set(eyebrowLine, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(headlineLines, { yPercent: 110 });
          gsap.set(supporting, { autoAlpha: 0, y: 20 });
          gsap.set(imageFrames, { clipPath: "inset(100% 0 0 0)" });
          gsap.set(imageMedia, { scale: 1.06 });
          gsap.set(featureDividers, {
            scaleX: 0,
            transformOrigin: "left center",
          });
          gsap.set(featureNumbers, { autoAlpha: 0, y: 10 });
          gsap.set(featureContent, { autoAlpha: 0, y: 14 });

          const isWideLayout = window.innerWidth >= 1280;
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              end: "bottom 30%",
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .fromTo(
              eyebrow,
              { autoAlpha: 0, y: 18 },
              { autoAlpha: 1, y: 0, duration: 0.14 },
              0,
            )
            .fromTo(
              eyebrowLine,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.14, transformOrigin: "left center" },
              0,
            )
            .fromTo(
              headlineLines,
              { yPercent: 110 },
              {
                yPercent: 0,
                duration: 0.16,
                stagger: 0.035,
                ease: "power3.out",
              },
              0.08,
            )
            .fromTo(
              supporting,
              { autoAlpha: 0, y: 20 },
              { autoAlpha: 1, y: 0, duration: 0.18, ease: "power3.out" },
              0.22,
            )
            .fromTo(
              imageFrames,
              { clipPath: "inset(100% 0 0 0)" },
              {
                clipPath: "inset(0% 0 0 0)",
                duration: 0.34,
                stagger: 0.055,
                ease: "power3.out",
              },
              0.2,
            )
            .fromTo(
              imageMedia,
              { scale: 1.06 },
              {
                scale: 1,
                duration: 0.36,
                stagger: 0.055,
                ease: "power3.out",
              },
              0.2,
            )
            .fromTo(
              featureDividers,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 0.17,
                stagger: 0.095,
                transformOrigin: "left center",
              },
              0.42,
            )
            .fromTo(
              featureNumbers,
              { autoAlpha: 0, y: 10 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.14,
                stagger: 0.095,
                ease: "power3.out",
              },
              0.44,
            )
            .fromTo(
              featureContent,
              { autoAlpha: 0, y: 14 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.17,
                stagger: 0.095,
                ease: "power3.out",
              },
              0.46,
            )
            .to(mainParallax, { y: isWideLayout ? -34 : -20, duration: 0.45 }, 0.55)
            .to(upperParallax, { y: isWideLayout ? 18 : 11, duration: 0.45 }, 0.55)
            .to(lowerParallax, { y: isWideLayout ? -22 : -13, duration: 0.45 }, 0.55);

          return () => timeline.kill();
        },
      );

      media.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          const revealNodes = select<HTMLElement>("[data-experience-mobile-reveal]");
          const animations = revealNodes.map((node) =>
            gsap.fromTo(
              node,
              { autoAlpha: 0, y: 20 },
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
      id="experiencia"
      aria-labelledby="experiencia-titulo"
      className={clsx(
        nunitoClassName,
        "relative overflow-clip bg-[#FBFAF8] px-6 py-24 text-[#1E1B19] sm:px-8 lg:px-[clamp(32px,5vw,88px)] lg:py-[clamp(120px,11vw,190px)]",
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          frauncesClassName,
          "pointer-events-none absolute -right-12 top-16 hidden select-none text-[clamp(9rem,17vw,18rem)] font-normal leading-none tracking-normal text-[rgba(79,62,48,0.035)] xl:block",
        )}
      >
        ESSÊNCIA
      </span>

      <div className="relative mx-auto flex max-w-[1680px] flex-col xl:grid xl:grid-cols-[minmax(340px,0.82fr)_minmax(580px,1.18fr)] xl:items-start xl:gap-x-[clamp(64px,7vw,140px)]">
        <ExperienceIntro
          frauncesClassName={frauncesClassName}
          className="order-1 xl:col-start-1 xl:row-start-1"
        />

        <HairstyleEditorialGallery
          images={experienceImages}
          className="order-2 xl:col-start-2 xl:row-span-2 xl:row-start-1"
        />

        <ExperienceFeatureList
          features={experienceFeatures}
          frauncesClassName={frauncesClassName}
          className="order-3 mt-14 md:order-2 xl:order-none xl:col-start-1 xl:row-start-2 xl:mt-20"
        />
      </div>
    </section>
  );
}

function ExperienceIntro({
  frauncesClassName,
  className,
}: {
  frauncesClassName: string;
  className?: string;
}) {
  return (
    <div className={clsx("max-w-[650px]", className)}>
      <div
        data-experience-eyebrow
        data-experience-mobile-reveal
        className="flex items-center gap-3 text-[0.68rem] font-extrabold uppercase leading-4 tracking-normal text-[#9A7E60] sm:text-xs"
      >
        <Sparkles className="size-4 shrink-0" aria-hidden="true" />
        <span>A experiência</span>
        <span
          data-experience-eyebrow-line
          aria-hidden="true"
          className="h-px w-12 bg-[#B49A7A]/70"
        />
      </div>

      <h2
        id="experiencia-titulo"
        className={clsx(
          frauncesClassName,
          "mt-7 text-[clamp(2.45rem,10vw,3.2rem)] font-normal leading-[0.94] tracking-normal text-[#1E1B19] md:text-[clamp(3.3rem,6vw,5rem)] xl:text-[clamp(2rem,2.65vw,3.2rem)]",
        )}
      >
        {[
          "Beleza, cuidado e",
          "confiança em cada",
          "detalhe.",
        ].map((line) => (
          <span key={line} className="block overflow-hidden pb-[0.06em]">
            <span
              data-experience-headline-line
              data-experience-mobile-reveal
              className="block xl:whitespace-nowrap"
            >
              {line}
            </span>
          </span>
        ))}
      </h2>

      <p
        data-experience-supporting
        data-experience-mobile-reveal
        className="mt-7 max-w-[560px] text-[0.98rem] font-semibold leading-[1.7] text-[#716B66] sm:text-[1.05rem]"
      >
        Cada penteado é pensado para valorizar sua essência e acompanhar um dos
        momentos mais especiais da sua história.
      </p>
    </div>
  );
}

function ExperienceFeatureList({
  features,
  frauncesClassName,
  className,
}: {
  features: ExperienceFeature[];
  frauncesClassName: string;
  className?: string;
}) {
  return (
    <ol className={clsx("max-w-[650px]", className)}>
      {features.map((feature) => (
        <ExperienceFeatureItem
          key={feature.number}
          feature={feature}
          frauncesClassName={frauncesClassName}
        />
      ))}
    </ol>
  );
}

function ExperienceFeatureItem({
  feature,
  frauncesClassName,
}: {
  feature: ExperienceFeature;
  frauncesClassName: string;
}) {
  return (
    <li
      data-experience-mobile-reveal
      className="group relative grid grid-cols-[46px_1px_minmax(0,1fr)] gap-x-4 py-7 sm:grid-cols-[58px_1px_minmax(0,1fr)] sm:gap-x-6 sm:py-8"
    >
      <span
        data-experience-divider
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[rgba(79,62,48,0.14)]"
      />
      <span
        data-experience-number
        className={clsx(
          frauncesClassName,
          "text-[2.15rem] font-normal leading-none tracking-normal text-[#B49A7A]/80 sm:text-[2.65rem]",
        )}
        aria-hidden="true"
      >
        {feature.number}
      </span>
      <span aria-hidden="true" className="h-full w-px bg-[rgba(79,62,48,0.14)]" />
      <span
        data-experience-feature-content
        className="block min-w-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5"
      >
        <span
          className={clsx(
            frauncesClassName,
            "block text-[clamp(1.45rem,1.8vw,2rem)] font-normal leading-[1.1] tracking-normal text-[#2B2724] transition-colors duration-300 group-hover:text-[#1E1B19]",
          )}
        >
          {feature.title}
        </span>
        <span className="mt-3 block text-sm font-semibold leading-6 text-[#716B66] sm:text-[0.96rem] sm:leading-7">
          {feature.description}
        </span>
      </span>
    </li>
  );
}

function HairstyleEditorialGallery({
  images,
  className,
}: {
  images: ExperienceImage[];
  className?: string;
}) {
  const [mainImage, upperImage, lowerImage] = images;

  return (
    <div
      className={clsx(
        "contents xl:grid xl:grid-cols-[minmax(0,1.55fr)_minmax(220px,1fr)] xl:gap-4",
        className,
      )}
    >
      <EditorialImage
        image={mainImage}
        motion="main"
        sizes="(min-width: 1100px) 34vw, (min-width: 768px) 70vw, calc(100vw - 48px)"
        className="order-2 mt-12 aspect-[4/5] md:order-3 md:w-full md:max-w-[780px] xl:order-none xl:mt-0"
      />

      <div className="order-4 mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:w-full md:max-w-[780px] xl:mt-0 xl:max-w-none xl:grid-cols-1 xl:grid-rows-2">
        <EditorialImage
          image={upperImage}
          motion="upper"
          sizes="(min-width: 1100px) 22vw, calc(50vw - 30px)"
          className="aspect-[4/3] xl:aspect-auto xl:h-full"
        />
        <EditorialImage
          image={lowerImage}
          motion="lower"
          sizes="(min-width: 1100px) 22vw, calc(50vw - 30px)"
          className="aspect-[4/3] xl:aspect-auto xl:h-full"
        />
      </div>
    </div>
  );
}

function EditorialImage({
  image,
  motion,
  sizes,
  className,
}: {
  image: ExperienceImage;
  motion: "main" | "upper" | "lower";
  sizes: string;
  className?: string;
}) {
  return (
    <figure
      data-experience-frame
      data-experience-mobile-reveal
      className={clsx(
        "group relative min-h-0 overflow-hidden rounded-[16px] bg-[#F6F1EB] shadow-[0_18px_50px_rgba(48,35,25,0.055)]",
        className,
      )}
    >
      <div
        data-experience-parallax={motion}
        className="absolute -inset-y-8 inset-x-0 will-change-transform"
      >
        <div
          data-experience-media
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes={sizes}
            loading={motion === "main" ? "eager" : "lazy"}
            className="h-full w-full object-cover"
            style={{ objectPosition: image.focalPosition }}
          />
        </div>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[rgba(48,35,25,0.06)] transition-colors duration-700 group-hover:bg-transparent"
      />
      {image.caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/35 to-transparent px-4 pb-3 pt-10 text-[0.68rem] font-bold text-white/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:px-5 sm:pb-4">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
