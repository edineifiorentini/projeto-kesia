"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type RefObject,
} from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { clsx } from "clsx";
import {
  renderableTestimonials,
  type WhatsAppTestimonial,
} from "@/lib/testimonials-repository";

type WhatsAppTestimonialsSectionProps = {
  frauncesClassName: string;
  nunitoClassName: string;
  whatsappPhone: string;
  items?: WhatsAppTestimonial[];
};

type TestimonialTransition = {
  previousIndex: number;
};

const transitionDuration = 720;
const defaultDisplayDuration = 9_000;

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const update = () => setIsVisible(document.visibilityState === "visible");

    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return isVisible;
}

function useSectionVisibility(sectionRef: RefObject<HTMLElement | null>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "160px 0px", threshold: 0.08 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef]);

  return isVisible;
}

async function preloadScreenshot(src: string) {
  await new Promise<void>((resolve, reject) => {
    const image = new window.Image();
    let completed = false;

    const finish = async () => {
      if (completed) {
        return;
      }

      completed = true;
      try {
        await image.decode();
      } catch {
        // A successfully loaded screenshot can still be used without decode().
      }
      resolve();
    };

    image.decoding = "async";
    image.onload = finish;
    image.onerror = () => reject(new Error(`Unable to load testimonial: ${src}`));
    image.src = src;

    if (image.complete && image.naturalWidth > 0) {
      void finish();
    }
  });
}

function getDisplayDuration(
  testimonial: WhatsAppTestimonial | undefined,
  isMobile: boolean,
  isTablet: boolean,
) {
  const configured = testimonial?.displayDurationMs ?? defaultDisplayDuration;

  if (isMobile) {
    return Math.max(11_000, configured);
  }

  return isTablet ? Math.round(configured * 1.15) : configured;
}

function useTestimonialRotation({
  globallyPaused,
  isMobile,
  isTablet,
  items,
}: {
  globallyPaused: boolean;
  isMobile: boolean;
  isTablet: boolean;
  items: WhatsAppTestimonial[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transition, setTransition] = useState<TestimonialTransition | null>(null);
  const [progressCycle, setProgressCycle] = useState(0);
  const [scheduleVersion, setScheduleVersion] = useState(0);
  const [manualAnnouncement, setManualAnnouncement] = useState("");
  const activeIndexRef = useRef(0);
  const failedIdsRef = useRef(new Set<string>());
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeItem = items[activeIndex];
  const displayDuration = getDisplayDuration(activeItem, isMobile, isTablet);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(
    () => () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    },
    [],
  );

  const changeTo = useCallback(
    async (requestedIndex: number, announce: boolean) => {
      if (items.length <= 1) {
        return false;
      }

      const normalizedIndex = (requestedIndex + items.length) % items.length;
      const currentIndex = activeIndexRef.current;
      const nextItem = items[normalizedIndex];

      if (normalizedIndex === currentIndex || !nextItem) {
        return false;
      }

      try {
        await preloadScreenshot(nextItem.screenshotUrl);
      } catch {
        failedIdsRef.current.add(nextItem.id);
        return false;
      }

      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }

      setTransition({ previousIndex: currentIndex });
      activeIndexRef.current = normalizedIndex;
      setActiveIndex(normalizedIndex);
      setProgressCycle((current) => current + 1);

      if (announce) {
        setManualAnnouncement(`Depoimento selecionado: ${nextItem.displayName}.`);
      }

      transitionTimerRef.current = setTimeout(() => {
        setTransition(null);
        transitionTimerRef.current = null;
      }, transitionDuration);

      return true;
    },
    [items],
  );

  const chooseNextIndex = useCallback(() => {
    if (items.length <= 1) {
      return null;
    }

    for (let offset = 1; offset < items.length; offset += 1) {
      const candidateIndex = (activeIndexRef.current + offset) % items.length;
      if (!failedIdsRef.current.has(items[candidateIndex].id)) {
        return candidateIndex;
      }
    }

    return null;
  }, [items]);

  useEffect(() => {
    if (globallyPaused || items.length <= 1) {
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      const nextIndex = chooseNextIndex();
      if (nextIndex === null || cancelled) {
        return;
      }

      const changed = await changeTo(nextIndex, false);
      if (!changed && !cancelled) {
        setScheduleVersion((current) => current + 1);
      }
    }, displayDuration);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [changeTo, chooseNextIndex, displayDuration, globallyPaused, items.length, scheduleVersion]);

  const selectIndex = useCallback(
    (index: number) => {
      void changeTo(index, true);
    },
    [changeTo],
  );

  const showPrevious = useCallback(() => {
    void changeTo(activeIndexRef.current - 1, true);
  }, [changeTo]);

  const showNext = useCallback(() => {
    void changeTo(activeIndexRef.current + 1, true);
  }, [changeTo]);

  return {
    activeIndex,
    activeItem,
    displayDuration,
    manualAnnouncement,
    previousItem:
      transition && items[transition.previousIndex]
        ? items[transition.previousIndex]
        : null,
    progressCycle,
    selectIndex,
    showNext,
    showPrevious,
  };
}

function whatsappHref(phone: string) {
  const message =
    "Olá, Késia! Gostaria de conversar sobre um penteado para o meu momento especial.";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppTestimonialsSection({
  frauncesClassName,
  nunitoClassName,
  whatsappPhone,
  items = renderableTestimonials,
}: WhatsAppTestimonialsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [phoneHovered, setPhoneHovered] = useState(false);
  const [controlsFocused, setControlsFocused] = useState(false);
  const pageVisible = usePageVisibility();
  const sectionVisible = useSectionVisibility(sectionRef);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1099px)");

  const safeItems = useMemo(
    () =>
      [...items]
        .filter(
          (item) =>
            item.active &&
            ((item.developmentOnly && process.env.NODE_ENV === "development") ||
              (item.publicationConsent && item.redactionApplied)),
        )
        .sort((first, second) => first.sortOrder - second.sortOrder),
    [items],
  );
  const globallyPaused =
    !pageVisible ||
    !sectionVisible ||
    reducedMotion ||
    phoneHovered ||
    controlsFocused;
  const rotation = useTestimonialRotation({
    globallyPaused,
    isMobile,
    isTablet,
    items: safeItems,
  });

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
        const eyebrow = select<HTMLElement>("[data-testimonials-eyebrow]");
        const headlineLines = select<HTMLElement>("[data-testimonials-headline-line]");
        const supporting = select<HTMLElement>("[data-testimonials-supporting]");
        const phone = select<HTMLElement>("[data-testimonials-phone]");
        const controls = select<HTMLElement>("[data-testimonials-controls]");

        gsap.set(eyebrow, { autoAlpha: 0, y: 16 });
        gsap.set(headlineLines, { autoAlpha: 0, yPercent: 105 });
        gsap.set(supporting, { autoAlpha: 0, y: 18 });
        gsap.set(phone, { autoAlpha: 0, y: 42, scale: 0.975 });
        gsap.set(controls, { autoAlpha: 0, y: 16 });

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
            { autoAlpha: 1, yPercent: 0, duration: 0.94, stagger: 0.1 },
            0.12,
          )
          .to(supporting, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.48)
          .to(phone, { autoAlpha: 1, y: 0, scale: 1, duration: 1.05 }, 0.3)
          .to(controls, { autoAlpha: 1, y: 0, duration: 0.68 }, 0.72);
      });

    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, [isTablet]);

  const focusWithin = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setControlsFocused(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="depoimentos"
      aria-labelledby="depoimentos-titulo"
      className={clsx(
        nunitoClassName,
        "relative overflow-clip bg-[#FBF8F3] px-6 py-[92px] text-[#261D18] md:px-10 md:py-[110px] min-[1200px]:px-[clamp(48px,5vw,88px)] min-[1200px]:py-[clamp(110px,9vw,180px)]",
      )}
    >
      <div className="testimonials-editorial-layout mx-auto max-w-[1660px]">
        <TestimonialsIntro frauncesClassName={frauncesClassName} />

        <div
          data-testimonials-phone-parallax
          className="testimonials-phone-column"
        >
          <TestimonialPhone
            activeItem={rotation.activeItem}
            previousItem={rotation.previousItem}
            onHoverChange={setPhoneHovered}
          />
        </div>

        <div
          data-testimonials-controls
          className="testimonials-controls-column"
          onFocusCapture={() => setControlsFocused(true)}
          onBlurCapture={focusWithin}
        >
          {safeItems.length > 0 ? (
            <>
              <TestimonialProgress
                activeIndex={rotation.activeIndex}
                activeItem={rotation.activeItem}
                displayDuration={rotation.displayDuration}
                items={safeItems}
                paused={globallyPaused}
                progressCycle={rotation.progressCycle}
              />
              <TestimonialNavigation
                activeIndex={rotation.activeIndex}
                items={safeItems}
                onNext={rotation.showNext}
                onPrevious={rotation.showPrevious}
                onSelect={rotation.selectIndex}
              />
            </>
          ) : null}

          <a
            href={whatsappHref(whatsappPhone)}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-md bg-[#B46F4B] px-6 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(91,52,32,0.14)] transition-colors duration-300 hover:bg-[#9E5C3D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9E5C3D] sm:w-auto"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Quero viver essa experiência
          </a>

          <p className="mt-5 flex max-w-[520px] items-start gap-2.5 text-xs font-bold leading-5 text-[#746A62]">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#B46F4B]" aria-hidden="true" />
            {!rotation.activeItem
              ? "Depoimentos reais serão publicados somente após autorização e proteção dos dados pessoais."
              : rotation.activeItem.developmentOnly
                ? "Prévia técnica sem dados reais. Este material não é publicado em produção."
                : "Depoimentos publicados com autorização e dados pessoais protegidos."}
          </p>
          <p className="mt-5 text-sm font-semibold italic text-[#806E62]">
            Mais do que penteados, memórias que ficam.
          </p>
          <span className="sr-only" aria-live="polite">
            {rotation.manualAnnouncement}
          </span>
        </div>
      </div>
    </section>
  );
}

function TestimonialsIntro({ frauncesClassName }: { frauncesClassName: string }) {
  return (
    <header className="testimonials-intro max-w-[720px]">
      <div
        data-testimonials-eyebrow
        className="flex items-center gap-3 text-[0.72rem] font-extrabold uppercase leading-4 tracking-[0.2em] text-[#AA7652]"
      >
        <Sparkles className="size-4 shrink-0" aria-hidden="true" />
        <span>Depoimentos</span>
        <span className="h-px w-12 bg-[#AA7652]/60" aria-hidden="true" />
      </div>
      <h2
        id="depoimentos-titulo"
        className={clsx(
          frauncesClassName,
          "mt-6 text-[clamp(3rem,11vw,4.25rem)] font-normal leading-[0.96] tracking-normal min-[900px]:text-[clamp(4rem,5.2vw,6.5rem)]",
        )}
      >
        <span className="block overflow-hidden pb-[0.06em]">
          <span data-testimonials-headline-line className="block">
            Mensagens reais
          </span>
        </span>
        <span className="block overflow-hidden pb-[0.06em]">
          <span data-testimonials-headline-line className="block">
            de quem viveu
          </span>
        </span>
        <span className="block overflow-hidden pb-[0.09em]">
          <span data-testimonials-headline-line className="block italic text-[#6D4B36]">
            esse momento.
          </span>
        </span>
      </h2>
      <p
        data-testimonials-supporting
        className="mt-6 max-w-[560px] text-[clamp(1rem,1.2vw,1.2rem)] font-semibold leading-[1.65] text-[#746A62]"
      >
        Cada mensagem carrega mais do que palavras: confiança, gratidão e a
        certeza de ter feito a escolha certa.
      </p>
    </header>
  );
}

function TestimonialPhone({
  activeItem,
  onHoverChange,
  previousItem,
}: {
  activeItem: WhatsAppTestimonial | undefined;
  onHoverChange: (hovered: boolean) => void;
  previousItem: WhatsAppTestimonial | null;
}) {
  return (
    <div
      data-testimonials-phone
      className="testimonial-phone-shell"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <span className="testimonial-phone-side-button testimonial-phone-side-button--left" aria-hidden="true" />
      <span className="testimonial-phone-side-button testimonial-phone-side-button--right" aria-hidden="true" />
      <div className="testimonial-phone-bezel">
        <div className="testimonial-phone-screen">
          <span className="testimonial-phone-island" aria-hidden="true" />
          <TestimonialScreenshotStage
            activeItem={activeItem}
            previousItem={previousItem}
          />
          <span className="testimonial-phone-home" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function TestimonialScreenshotStage({
  activeItem,
  previousItem,
}: {
  activeItem: WhatsAppTestimonial | undefined;
  previousItem: WhatsAppTestimonial | null;
}) {
  if (!activeItem) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[#EEE9E2] px-8 text-center">
        <div className="max-w-[230px]">
          <ShieldCheck className="mx-auto size-8 text-[#AA7652]" aria-hidden="true" />
          <p className="mt-4 text-sm font-extrabold leading-6 text-[#5F5148]">
            Depoimentos autorizados serão exibidos aqui.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#EEE9E2]">
      {previousItem ? (
        <TestimonialScreenshot
          key={`outgoing-${previousItem.id}`}
          ariaHidden
          className="testimonial-screenshot--outgoing"
          item={previousItem}
        />
      ) : null}
      <TestimonialScreenshot
        key={`active-${activeItem.id}`}
        className={clsx(
          "testimonial-screenshot--active",
          previousItem && "testimonial-screenshot--incoming",
        )}
        item={activeItem}
      />
    </div>
  );
}

function TestimonialScreenshot({
  ariaHidden = false,
  className,
  item,
}: {
  ariaHidden?: boolean;
  className?: string;
  item: WhatsAppTestimonial;
}) {
  const style = {
    "--testimonial-pan-start": `${item.panStart ?? 0}%`,
    "--testimonial-pan-end": `${item.panEnd ?? 0}%`,
    "--testimonial-pan-duration": `${Math.max(4_000, (item.displayDurationMs ?? defaultDisplayDuration) - 1_000)}ms`,
  } as CSSProperties;

  return (
    <span
      aria-hidden={ariaHidden || undefined}
      className={clsx(
        "testimonial-screenshot-layer absolute inset-0",
        className,
      )}
    >
      <span
        className={clsx(
          "testimonial-screenshot-pan absolute -inset-2",
          item.verticalPan && "testimonial-screenshot--panning",
        )}
        style={style}
      >
        <Image
          src={item.screenshotUrl}
          alt={ariaHidden ? "" : item.altText}
          fill
          unoptimized={item.screenshotUrl.endsWith(".svg")}
          priority={!ariaHidden && item.sortOrder === 1}
          sizes="(min-width: 1100px) 450px, (min-width: 768px) 390px, 82vw"
          className="object-cover"
          style={{ objectPosition: item.screenPosition ?? "center top" }}
        />
      </span>
    </span>
  );
}

function TestimonialProgress({
  activeIndex,
  activeItem,
  displayDuration,
  items,
  paused,
  progressCycle,
}: {
  activeIndex: number;
  activeItem: WhatsAppTestimonial | undefined;
  displayDuration: number;
  items: WhatsAppTestimonial[];
  paused: boolean;
  progressCycle: number;
}) {
  const progressStyle = {
    "--testimonial-progress-duration": `${displayDuration}ms`,
    animationPlayState: paused ? "paused" : "running",
  } as CSSProperties;

  return (
    <div className="flex items-center gap-4" aria-label="Progresso dos depoimentos">
      <p className="min-w-[72px] text-sm font-extrabold text-[#6D4B36]">
        {activeItem ? String(activeIndex + 1).padStart(2, "0") : "00"}
        <span className="mx-1.5 text-[#B8A99E]">/</span>
        <span className="text-[#9A8B81]">{String(items.length).padStart(2, "0")}</span>
      </p>
      <div className="h-0.5 w-[clamp(150px,20vw,240px)] overflow-hidden bg-[#B46F4B]/18">
        {activeItem ? (
          <span
            key={`${activeItem.id}-${progressCycle}`}
            className="testimonial-progress-fill block h-full origin-left bg-[#B46F4B]"
            style={progressStyle}
          />
        ) : null}
      </div>
    </div>
  );
}

function TestimonialNavigation({
  activeIndex,
  items,
  onNext,
  onPrevious,
  onSelect,
}: {
  activeIndex: number;
  items: WhatsAppTestimonial[];
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (index: number) => void;
}) {
  const disabled = items.length <= 1;

  return (
    <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-x-5 gap-y-2" role="group" aria-label="Selecionar depoimento">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(index)}
            className={clsx(
              "border-b pb-1 text-xs font-extrabold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#AA7652]",
              index === activeIndex
                ? "border-[#AA7652] text-[#4D392E]"
                : "border-transparent text-[#9A8B81] hover:text-[#6D4B36]",
            )}
            aria-pressed={index === activeIndex}
          >
            {item.displayName}
          </button>
        ))}
      </div>
      <div className="flex gap-2" role="group" aria-label="Navegar pelos depoimentos">
        <button
          type="button"
          onClick={onPrevious}
          disabled={disabled}
          className="grid size-11 place-items-center rounded-full border border-[#B49A87]/50 text-[#6D4B36] transition-colors hover:bg-[#F4E9DD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#AA7652] disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Depoimento anterior"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={disabled}
          className="grid size-11 place-items-center rounded-full border border-[#B49A87]/50 text-[#6D4B36] transition-colors hover:bg-[#F4E9DD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#AA7652] disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Próximo depoimento"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
