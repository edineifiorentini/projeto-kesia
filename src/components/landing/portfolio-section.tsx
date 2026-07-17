"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import Image from "next/image";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Expand,
  Sparkles,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import {
  portfolioCategoryLabels,
  portfolioImages,
  type PortfolioImage,
} from "@/lib/portfolio-repository";
import { PremiumAction } from "@/components/ui/premium-action";

type PortfolioSectionProps = {
  bookingPath: string;
  frauncesClassName: string;
  nunitoClassName: string;
  items?: PortfolioImage[];
};

type PortfolioSlotId =
  | "slot-main"
  | "slot-top-center"
  | "slot-top-right"
  | "slot-middle-right"
  | "slot-bottom-left"
  | "slot-bottom-center"
  | "slot-bottom-right";

type PortfolioSlotConfig = {
  id: PortfolioSlotId;
  interval: number;
  initialDelay: number;
  parallax: readonly [number, number];
  sizes: string;
};

type SlotAssignments = Record<PortfolioSlotId, string | null>;
type SlotTransitions = Partial<Record<PortfolioSlotId, { previousId: string }>>;

const portfolioSlotConfigs: PortfolioSlotConfig[] = [
  {
    id: "slot-main",
    interval: 12_000,
    initialDelay: 12_000,
    parallax: [22, -24],
    sizes: "(min-width: 1100px) 34vw, (min-width: 768px) 50vw, 100vw",
  },
  {
    id: "slot-top-center",
    interval: 7_600,
    initialDelay: 5_000,
    parallax: [14, -14],
    sizes: "(min-width: 1100px) 34vw, (min-width: 768px) 50vw, 50vw",
  },
  {
    id: "slot-top-right",
    interval: 8_400,
    initialDelay: 6_800,
    parallax: [20, -16],
    sizes: "(min-width: 1100px) 34vw, (min-width: 768px) 50vw, 50vw",
  },
  {
    id: "slot-middle-right",
    interval: 9_200,
    initialDelay: 8_600,
    parallax: [16, -18],
    sizes: "(min-width: 1100px) 34vw, (min-width: 768px) 50vw, 100vw",
  },
  {
    id: "slot-bottom-left",
    interval: 8_000,
    initialDelay: 10_400,
    parallax: [18, -15],
    sizes: "(min-width: 1100px) 34vw, (min-width: 768px) 50vw, 50vw",
  },
  {
    id: "slot-bottom-center",
    interval: 8_800,
    initialDelay: 12_200,
    parallax: [24, -20],
    sizes: "(min-width: 1100px) 34vw, (min-width: 768px) 50vw, 50vw",
  },
  {
    id: "slot-bottom-right",
    interval: 9_600,
    initialDelay: 14_000,
    parallax: [14, -18],
    sizes: "(min-width: 1100px) 34vw, (min-width: 768px) 100vw, 100vw",
  },
];

const transitionDuration = 1_100;
const minimumTransitionGap = 4_200;
const recentHistorySize = 6;

function createInitialAssignments(items: PortfolioImage[]): SlotAssignments {
  const preferredItems = [...items].sort((first, second) => {
    if (first.featured !== second.featured) {
      return first.featured ? -1 : 1;
    }

    return first.sortOrder - second.sortOrder;
  });

  return portfolioSlotConfigs.reduce<SlotAssignments>((assignments, slot, index) => {
    assignments[slot.id] = preferredItems[index]?.id ?? null;
    return assignments;
  }, {} as SlotAssignments);
}

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
      { rootMargin: "180px 0px", threshold: 0.08 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef]);

  return isVisible;
}

async function preloadPortfolioImage(src: string) {
  await new Promise<void>((resolve, reject) => {
    const image = new window.Image();
    image.decoding = "async";
    const finish = async () => {
      try {
        await image.decode();
      } catch {
        // A loaded image is still safe to display when decode() is unsupported.
      }
      resolve();
    };
    image.onload = finish;
    image.onerror = () => reject(new Error(`Unable to load portfolio image: ${src}`));
    image.src = src;

    if (image.complete && image.naturalWidth > 0) {
      void finish();
    }
  });
}

function usePortfolioRotation({
  globallyPaused,
  items,
}: {
  globallyPaused: boolean;
  items: PortfolioImage[];
}) {
  const [assignments, setAssignments] = useState<SlotAssignments>(() =>
    createInitialAssignments(items),
  );
  const [transitions, setTransitions] = useState<SlotTransitions>({});
  const assignmentsRef = useRef(assignments);
  const pausedSlotsRef = useRef(new Set<PortfolioSlotId>());
  const nextDueRef = useRef<Partial<Record<PortfolioSlotId, number>>>({});
  const recentImagesRef = useRef<string[]>([]);
  const candidateCursorRef = useRef(0);
  const lastTransitionRef = useRef(0);
  const transitionCleanupRef = useRef(
    new Map<PortfolioSlotId, ReturnType<typeof setTimeout>>(),
  );

  const itemById = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items],
  );
  const itemSignature = useMemo(() => items.map((item) => item.id).join("|"), [items]);

  useEffect(() => {
    const reset = setTimeout(() => {
      const initialAssignments = createInitialAssignments(items);
      assignmentsRef.current = initialAssignments;
      recentImagesRef.current = Object.values(initialAssignments).filter(
        (id): id is string => Boolean(id),
      );
      setAssignments(initialAssignments);
    }, 0);

    return () => clearTimeout(reset);
  }, [itemSignature, items]);

  useEffect(() => {
    assignmentsRef.current = assignments;
  }, [assignments]);

  useEffect(
    () => () => {
      transitionCleanupRef.current.forEach((timeout) => clearTimeout(timeout));
      transitionCleanupRef.current.clear();
    },
    [],
  );

  const setSlotPaused = useCallback((slotId: PortfolioSlotId, paused: boolean) => {
    const nextPausedSlots = new Set(pausedSlotsRef.current);

    if (paused) {
      nextPausedSlots.add(slotId);
    } else {
      nextPausedSlots.delete(slotId);
      const slot = portfolioSlotConfigs.find((candidate) => candidate.id === slotId);
      if (slot) {
        nextDueRef.current[slotId] = Date.now() + slot.interval;
      }
    }

    pausedSlotsRef.current = nextPausedSlots;
  }, []);

  const chooseNextImage = useCallback(
    (slotId: PortfolioSlotId) => {
      const currentAssignments = assignmentsRef.current;
      const currentId = currentAssignments[slotId];
      const visibleIds = new Set(
        Object.values(currentAssignments).filter((id): id is string => Boolean(id)),
      );
      const visibleCategoryCounts = new Map<string, number>();

      visibleIds.forEach((id) => {
        const item = itemById.get(id);
        if (item) {
          visibleCategoryCounts.set(
            item.category,
            (visibleCategoryCounts.get(item.category) ?? 0) + 1,
          );
        }
      });

      const available = items.filter(
        (item) => item.active && item.id !== currentId && !visibleIds.has(item.id),
      );

      if (available.length === 0) {
        return null;
      }

      const recentIds = new Set(recentImagesRef.current);
      const notRecentlyUsed = available.filter((item) => !recentIds.has(item.id));
      const candidatePool = notRecentlyUsed.length > 0 ? notRecentlyUsed : available;

      candidatePool.sort((first, second) => {
        const categoryDifference =
          (visibleCategoryCounts.get(first.category) ?? 0) -
          (visibleCategoryCounts.get(second.category) ?? 0);

        return categoryDifference || first.sortOrder - second.sortOrder;
      });

      const leastUsedCategoryCount = visibleCategoryCounts.get(candidatePool[0].category) ?? 0;
      const diversePool = candidatePool.filter(
        (item) => (visibleCategoryCounts.get(item.category) ?? 0) === leastUsedCategoryCount,
      );
      const selected = diversePool[candidateCursorRef.current % diversePool.length];
      candidateCursorRef.current += 1;

      return selected;
    },
    [itemById, items],
  );

  const rotateSlot = useCallback(
    async (slotId: PortfolioSlotId) => {
      const currentId = assignmentsRef.current[slotId];
      const nextItem = chooseNextImage(slotId);

      if (!currentId || !nextItem) {
        return false;
      }

      try {
        await preloadPortfolioImage(nextItem.imageUrl);
      } catch {
        return false;
      }

      const nextAssignments = {
        ...assignmentsRef.current,
        [slotId]: nextItem.id,
      };
      assignmentsRef.current = nextAssignments;
      setTransitions((current) => ({
        ...current,
        [slotId]: { previousId: currentId },
      }));
      setAssignments(nextAssignments);

      recentImagesRef.current = [
        ...recentImagesRef.current.filter((id) => id !== nextItem.id),
        nextItem.id,
      ].slice(-recentHistorySize);

      const previousCleanup = transitionCleanupRef.current.get(slotId);
      if (previousCleanup) {
        clearTimeout(previousCleanup);
      }

      const cleanup = setTimeout(() => {
        setTransitions((current) => {
          const next = { ...current };
          delete next[slotId];
          return next;
        });
        transitionCleanupRef.current.delete(slotId);
      }, transitionDuration);
      transitionCleanupRef.current.set(slotId, cleanup);

      return true;
    },
    [chooseNextImage],
  );

  useEffect(() => {
    if (globallyPaused || items.length <= portfolioSlotConfigs.length) {
      return;
    }

    let cancelled = false;
    let scheduler: ReturnType<typeof setTimeout> | undefined;
    const now = Date.now();

    portfolioSlotConfigs.forEach((slot) => {
      nextDueRef.current[slot.id] = now + slot.initialDelay;
    });

    const scheduleNext = () => {
      if (cancelled) {
        return;
      }

      const availableSlots = portfolioSlotConfigs
        .filter((slot) => !pausedSlotsRef.current.has(slot.id))
        .sort(
          (first, second) =>
            (nextDueRef.current[first.id] ?? Number.POSITIVE_INFINITY) -
            (nextDueRef.current[second.id] ?? Number.POSITIVE_INFINITY),
        );

      if (availableSlots.length === 0) {
        scheduler = setTimeout(scheduleNext, 1_000);
        return;
      }

      const nextSlot = availableSlots[0];
      const currentTime = Date.now();
      const dueAt = nextDueRef.current[nextSlot.id] ?? currentTime + nextSlot.interval;
      const transitionGap = lastTransitionRef.current + minimumTransitionGap - currentTime;
      const delay = Math.max(300, dueAt - currentTime, transitionGap);

      scheduler = setTimeout(async () => {
        if (cancelled) {
          return;
        }

        if (pausedSlotsRef.current.has(nextSlot.id)) {
          nextDueRef.current[nextSlot.id] = Date.now() + nextSlot.interval;
          scheduleNext();
          return;
        }

        const changed = await rotateSlot(nextSlot.id);
        if (cancelled) {
          return;
        }

        const completedAt = Date.now();
        nextDueRef.current[nextSlot.id] = completedAt + nextSlot.interval;
        if (changed) {
          lastTransitionRef.current = completedAt;
        }
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => {
      cancelled = true;
      if (scheduler) {
        clearTimeout(scheduler);
      }
    };
  }, [globallyPaused, items.length, rotateSlot]);

  return { assignments, setSlotPaused, transitions };
}

export function PortfolioSection({
  bookingPath,
  frauncesClassName,
  nunitoClassName,
  items = portfolioImages,
}: PortfolioSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isPageVisible = usePageVisibility();
  const isSectionVisible = useSectionVisibility(sectionRef);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const activeItems = useMemo(
    () =>
      items
        .filter((item) => item.active)
        .sort((first, second) => first.sortOrder - second.sortOrder),
    [items],
  );
  const itemById = useMemo(
    () => new Map(activeItems.map((item) => [item.id, item])),
    [activeItems],
  );
  const globallyPaused =
    !isPageVisible ||
    !isSectionVisible ||
    isMobile ||
    prefersReducedMotion ||
    selectedId !== null;
  const { assignments, setSlotPaused, transitions } = usePortfolioRotation({
    globallyPaused,
    items: activeItems,
  });

  const selectedItem = selectedId ? itemById.get(selectedId) ?? null : null;
  const selectedIndex = selectedItem
    ? activeItems.findIndex((item) => item.id === selectedItem.id)
    : -1;

  const openLightbox = useCallback(
    (itemId: string, trigger: HTMLButtonElement) => {
      lastTriggerRef.current = trigger;
      setSelectedId(itemId);
    },
    [],
  );

  const closeLightbox = useCallback(() => setSelectedId(null), []);

  const navigateLightbox = useCallback(
    (direction: -1 | 1) => {
      if (activeItems.length === 0 || selectedIndex < 0) {
        return;
      }

      const nextIndex =
        (selectedIndex + direction + activeItems.length) % activeItems.length;
      setSelectedId(activeItems[nextIndex].id);
    },
    [activeItems, selectedIndex],
  );

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
          const eyebrow = select<HTMLElement>("[data-portfolio-eyebrow]");
          const eyebrowLine = select<HTMLElement>("[data-portfolio-eyebrow-line]");
          const headlineLines = select<HTMLElement>("[data-portfolio-headline-line]");
          const supporting = select<HTMLElement>("[data-portfolio-supporting]");
          const revealItems = select<HTMLElement>("[data-portfolio-reveal]");
          const cta = select<HTMLElement>("[data-portfolio-cta]");
          const parallaxLayers = select<HTMLElement>("[data-portfolio-parallax]");

          gsap.set(eyebrow, { autoAlpha: 0, y: 16 });
          gsap.set(eyebrowLine, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(headlineLines, { autoAlpha: 0, yPercent: 105 });
          gsap.set(supporting, { autoAlpha: 0, y: 18 });
          gsap.set(revealItems, {
            autoAlpha: 0,
            y: 38,
            scale: 1.02,
            clipPath: "inset(12% 0% 0% 0% round 16px)",
          });
          gsap.set(cta, { autoAlpha: 0, y: 18 });

          gsap
            .timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                once: true,
              },
            })
            .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.65 }, 0)
            .to(eyebrowLine, { scaleX: 1, duration: 0.6 }, 0.08)
            .to(
              headlineLines,
              { autoAlpha: 1, yPercent: 0, duration: 0.92, stagger: 0.11 },
              0.12,
            )
            .to(supporting, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.5)
            .to(
              revealItems,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                clipPath: "inset(0% 0% 0% 0% round 16px)",
                duration: 0.88,
                stagger: 0.09,
              },
              0.52,
            )
            .to(cta, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.98);

          const tabletFactor = window.innerWidth < 1_100 ? 0.55 : 1;
          parallaxLayers.forEach((layer) => {
            const slotId = layer.closest<HTMLElement>("[data-portfolio-slot]")?.dataset
              .portfolioSlot as PortfolioSlotId | undefined;
            const slot = portfolioSlotConfigs.find((candidate) => candidate.id === slotId);

            if (!slot) {
              return;
            }

            gsap.fromTo(
              layer,
              { y: slot.parallax[0] * tabletFactor },
              {
                y: slot.parallax[1] * tabletFactor,
                ease: "none",
                scrollTrigger: {
                  trigger: layer.closest("[data-portfolio-slot]"),
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
          const introItems = select<HTMLElement>("[data-portfolio-mobile-intro]");
          const revealItems = select<HTMLElement>("[data-portfolio-reveal]");
          const cta = select<HTMLElement>("[data-portfolio-cta]");

          gsap.set(introItems, { autoAlpha: 0, y: 22 });
          gsap.set(revealItems, { autoAlpha: 0, y: 30 });
          gsap.set(cta, { autoAlpha: 0, y: 18 });

          gsap.to(introItems, {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 86%", once: true },
          });

          revealItems.forEach((item) => {
            gsap.to(item, {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: { trigger: item, start: "top 90%", once: true },
            });
          });

          gsap.to(cta, {
            autoAlpha: 1,
            y: 0,
            duration: 0.68,
            ease: "power3.out",
            scrollTrigger: { trigger: cta, start: "top 92%", once: true },
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
    <Dialog.Root
      open={selectedItem !== null}
      onOpenChange={(open) => {
        if (!open) {
          closeLightbox();
        }
      }}
    >
      <section
        ref={sectionRef}
        id="penteados"
        aria-labelledby="portfolio-titulo"
        className={clsx(
          nunitoClassName,
          "portfolio-brand-section relative overflow-clip bg-[var(--color-background)] px-6 py-[92px] text-[var(--color-text-strong)] md:px-10 md:py-[110px] min-[1200px]:px-[clamp(48px,5vw,88px)] min-[1200px]:py-[clamp(110px,9vw,180px)]",
        )}
      >
        <span id="galeria" aria-hidden="true" className="absolute top-0" />
        <div className="mx-auto max-w-[1660px]">
          <PortfolioIntro frauncesClassName={frauncesClassName} />

          <PortfolioMosaic
            assignments={assignments}
            frauncesClassName={frauncesClassName}
            itemById={itemById}
            onOpen={openLightbox}
            onSlotPause={setSlotPaused}
            transitions={transitions}
          />

          <PortfolioClosingCTA
            bookingPath={bookingPath}
            frauncesClassName={frauncesClassName}
          />
        </div>
      </section>

      <PortfolioLightbox
        activeItems={activeItems}
        frauncesClassName={frauncesClassName}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
        restoreFocusRef={lastTriggerRef}
        selectedIndex={selectedIndex}
        selectedItem={selectedItem}
      />
    </Dialog.Root>
  );
}

function PortfolioIntro({ frauncesClassName }: { frauncesClassName: string }) {
  return (
    <header className="max-w-[980px]">
      <div
        data-portfolio-eyebrow
        data-portfolio-mobile-intro
        className="flex items-center gap-3 text-[0.72rem] font-extrabold uppercase leading-4 tracking-[0.22em] text-[var(--color-text-editorial-contrast)]"
      >
        <Sparkles className="size-4 shrink-0" aria-hidden="true" />
        <span>Portfólio</span>
        <span
          data-portfolio-eyebrow-line
          aria-hidden="true"
          className="h-px w-12 bg-[var(--color-text-editorial-contrast)]"
        />
      </div>

      <h2
        id="portfolio-titulo"
        data-portfolio-mobile-intro
        className={clsx(
          frauncesClassName,
          "mt-6 text-[clamp(3rem,11vw,4.4rem)] font-normal leading-[0.96] tracking-normal min-[900px]:text-[clamp(4rem,5.1vw,6.4rem)]",
        )}
      >
        <span className="block overflow-hidden pb-[0.06em]">
          <span data-portfolio-headline-line className="block">
            Belezas reais,
          </span>
        </span>
        <span className="block overflow-hidden pb-[0.09em]">
          <span data-portfolio-headline-line className="block">
            histórias que <em className="font-normal text-[var(--color-text)]">permanecem.</em>
          </span>
        </span>
      </h2>

      <p
        data-portfolio-supporting
        data-portfolio-mobile-intro
        className="mt-5 max-w-[650px] text-[1rem] font-semibold leading-7 text-[var(--color-text-muted)] md:text-[1.08rem]"
      >
        Cada penteado nasce de um momento, uma personalidade e uma forma única de se sentir bonita.
      </p>
    </header>
  );
}

function PortfolioMosaic({
  assignments,
  frauncesClassName,
  itemById,
  onOpen,
  onSlotPause,
  transitions,
}: {
  assignments: SlotAssignments;
  frauncesClassName: string;
  itemById: Map<string, PortfolioImage>;
  onOpen: (itemId: string, trigger: HTMLButtonElement) => void;
  onSlotPause: (slotId: PortfolioSlotId, paused: boolean) => void;
  transitions: SlotTransitions;
}) {
  return (
    <ul
      data-portfolio-mosaic
      className="portfolio-mosaic mt-[clamp(44px,5vw,72px)]"
      aria-label="Trabalhos selecionados de penteados"
    >
      {portfolioSlotConfigs.map((slot, index) => {
        const itemId = assignments[slot.id];
        const item = itemId ? itemById.get(itemId) ?? null : null;
        const previousId = transitions[slot.id]?.previousId;
        const previousItem = previousId ? itemById.get(previousId) ?? null : null;

        return (
          <Fragment key={slot.id}>
            <PortfolioSlot
              config={slot}
              compactCaption={index > 0}
              item={item}
              onOpen={onOpen}
              onSlotPause={onSlotPause}
              previousItem={previousItem}
            />
            {slot.id === "slot-top-right" ? (
              <PortfolioQuoteCell frauncesClassName={frauncesClassName} />
            ) : null}
          </Fragment>
        );
      })}
    </ul>
  );
}

function PortfolioSlot({
  compactCaption,
  config,
  item,
  onOpen,
  onSlotPause,
  previousItem,
}: {
  compactCaption: boolean;
  config: PortfolioSlotConfig;
  item: PortfolioImage | null;
  onOpen: (itemId: string, trigger: HTMLButtonElement) => void;
  onSlotPause: (slotId: PortfolioSlotId, paused: boolean) => void;
  previousItem: PortfolioImage | null;
}) {
  if (!item) {
    return (
      <li
        data-portfolio-reveal
        data-portfolio-slot={config.id}
        className="portfolio-slot bg-[var(--color-background-alt)]"
        aria-hidden="true"
      />
    );
  }

  const category = portfolioCategoryLabels[item.category];

  return (
    <li
      data-portfolio-reveal
      data-portfolio-slot={config.id}
      className="portfolio-slot group"
      onPointerEnter={() => onSlotPause(config.id, true)}
      onPointerLeave={() => onSlotPause(config.id, false)}
      onFocusCapture={() => onSlotPause(config.id, true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onSlotPause(config.id, false);
        }
      }}
    >
      <button
        type="button"
        data-current-image={item.id}
        data-transitioning={previousItem ? "true" : "false"}
        onClick={(event) => onOpen(item.id, event.currentTarget)}
        className="relative h-full w-full overflow-hidden rounded-[14px] bg-[var(--color-background-alt)] text-left shadow-[var(--shadow-soft)] outline-none transition-shadow duration-500 focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-background)]"
        aria-label={`${category}: ${item.title}. Abrir imagem ampliada.`}
      >
        <span data-portfolio-parallax className="absolute -inset-6 will-change-transform">
          {previousItem ? (
            <PortfolioImageLayer
              key={`previous-${previousItem.id}`}
              ariaHidden
              className="portfolio-image-layer--outgoing"
              item={previousItem}
              sizes={config.sizes}
            />
          ) : null}
          <PortfolioImageLayer
            key={`current-${item.id}`}
            className={clsx(
              "portfolio-image-layer--current",
              previousItem && "portfolio-image-layer--incoming",
            )}
            item={item}
            sizes={config.sizes}
          />
        </span>

        <span
          aria-hidden="true"
          className="portfolio-slot-overlay absolute inset-0 z-[2] bg-[var(--gradient-image-overlay-soft)] transition-colors duration-500"
        />

        <span
          key={`caption-${item.id}`}
          className="portfolio-slot-caption absolute inset-x-[clamp(18px,1.7vw,26px)] bottom-[clamp(18px,1.8vw,25px)] z-[3] max-w-[310px] text-[var(--color-surface)]"
        >
          <span className="block h-px w-9 bg-[var(--color-brand-primary)]" aria-hidden="true" />
          <span className="mt-2 block text-[0.68rem] font-extrabold uppercase leading-4 tracking-[0.1em] text-[var(--color-surface)]/90">
            {category}
          </span>
          <span
            className={clsx(
              "mt-1.5 block font-bold leading-[1.35] text-white",
              compactCaption ? "text-[0.82rem] md:text-[0.9rem]" : "text-[0.94rem] md:text-base",
            )}
          >
            {item.title}
          </span>
          <span className="portfolio-slot-action mt-2 flex items-center gap-1.5 text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-white/0 transition-colors duration-500 group-hover:text-white/85 group-focus-within:text-white/85 max-md:hidden">
            <Expand className="size-3" aria-hidden="true" />
            Ver trabalho
          </span>
        </span>
      </button>
    </li>
  );
}

function PortfolioImageLayer({
  ariaHidden = false,
  className,
  item,
  sizes,
}: {
  ariaHidden?: boolean;
  className?: string;
  item: PortfolioImage;
  sizes: string;
}) {
  return (
    <span
      aria-hidden={ariaHidden || undefined}
      className={clsx("portfolio-image-layer absolute inset-0", className)}
    >
      <Image
        src={item.imageUrl}
        alt={ariaHidden ? "" : item.altText}
        fill
        loading="lazy"
        sizes={sizes}
        quality={92}
        className="object-cover"
        style={{ objectPosition: item.imagePosition }}
      />
    </span>
  );
}

function PortfolioQuoteCell({ frauncesClassName }: { frauncesClassName: string }) {
  return (
    <li
      data-portfolio-reveal
      data-portfolio-quote
      className="portfolio-quote-cell grid place-items-center rounded-[14px] bg-[var(--color-surface-warm)] px-7 py-9 text-center"
    >
      <div className="max-w-[330px]">
        <Sparkles className="mx-auto size-5 text-[var(--color-brand-primary)]" aria-hidden="true" />
        <blockquote
          className={clsx(
            frauncesClassName,
            "mt-4 text-[clamp(1.6rem,2.1vw,2.35rem)] font-normal leading-[1.05] tracking-normal text-[var(--color-text-strong)]",
          )}
        >
          Cada detalhe pensado para que você continue sendo você, ainda mais bonita.
        </blockquote>
        <p className="mt-5 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[var(--color-brand-primary)]">
          Késia Dutra
        </p>
      </div>
    </li>
  );
}

function PortfolioClosingCTA({
  bookingPath,
  frauncesClassName,
}: {
  bookingPath: string;
  frauncesClassName: string;
}) {
  return (
    <div data-portfolio-cta className="mt-[clamp(38px,4vw,58px)] text-center">
      <div className="flex items-center justify-center gap-4">
        <span className="h-px w-10 bg-[var(--color-brand-primary-border)] sm:w-20" aria-hidden="true" />
        <Sparkles className="size-4 text-[var(--color-brand-primary)]" aria-hidden="true" />
        <span className="h-px w-10 bg-[var(--color-brand-primary-border)] sm:w-20" aria-hidden="true" />
      </div>
      <p
        className={clsx(
          frauncesClassName,
          "mx-auto mt-4 max-w-[620px] text-[clamp(1.55rem,2.3vw,2.25rem)] font-normal leading-tight tracking-normal text-[var(--color-text-strong)]",
        )}
      >
        Imaginou seu penteado entre essas histórias?
      </p>
      <PremiumAction asChild size="md" variant="outlineOnDark" className="mt-5">
        <Link prefetch={false} href={bookingPath}>
          <CalendarDays data-premium-leading aria-hidden="true" />
          <span>Agendar uma conversa</span>
          <ArrowRight data-premium-arrow aria-hidden="true" />
        </Link>
      </PremiumAction>
    </div>
  );
}

function PortfolioLightbox({
  activeItems,
  frauncesClassName,
  onClose,
  onNavigate,
  restoreFocusRef,
  selectedIndex,
  selectedItem,
}: {
  activeItems: PortfolioImage[];
  frauncesClassName: string;
  onClose: () => void;
  onNavigate: (direction: -1 | 1) => void;
  restoreFocusRef: RefObject<HTMLButtonElement | null>;
  selectedIndex: number;
  selectedItem: PortfolioImage | null;
}) {
  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onNavigate(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onNavigate(1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onNavigate, selectedItem]);

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[90] bg-[var(--color-overlay-modal)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      {selectedItem ? (
        <Dialog.Content
          aria-describedby="portfolio-lightbox-description"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            restoreFocusRef.current?.focus();
          }}
          className="fixed inset-0 z-[100] grid overflow-y-auto bg-[var(--color-text-strong)] text-white outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 md:inset-6 md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] md:overflow-hidden md:rounded-lg lg:inset-10"
        >
          <div className="relative min-h-[62svh] overflow-hidden bg-black/20 md:min-h-0">
            <Image
              key={selectedItem.id}
              src={selectedItem.imageUrl}
              alt={selectedItem.altText}
              fill
              priority
              sizes="(min-width: 768px) 75vw, 100vw"
              quality={92}
              className="portfolio-lightbox-image object-contain"
              style={{ objectPosition: selectedItem.imagePosition }}
            />

            <button
              type="button"
              onClick={() => onNavigate(-1)}
              className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:left-5"
              aria-label="Ver trabalho anterior"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate(1)}
              className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-5"
              aria-label="Ver próximo trabalho"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          <aside className="relative flex flex-col justify-between bg-[var(--color-text-strong)] p-6 sm:p-8 md:p-9">
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-5 grid size-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Fechar portfólio ampliado"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </Dialog.Close>

            <div className="pt-14 md:pt-20">
              <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[var(--color-brand-primary)]">
                {portfolioCategoryLabels[selectedItem.category]}
              </p>
              <Dialog.Title
                className={clsx(
                  frauncesClassName,
                  "mt-4 text-[clamp(2rem,3.4vw,3.7rem)] font-normal leading-[1.02] tracking-normal",
                )}
              >
                {selectedItem.title}
              </Dialog.Title>
              <Dialog.Description
                id="portfolio-lightbox-description"
                className="mt-5 text-[0.95rem] font-semibold leading-7 text-white/68"
              >
                {selectedItem.description ?? "Resultado personalizado para um momento especial."}
              </Dialog.Description>
            </div>

            <div className="mt-10 border-t border-white/14 pt-5">
              <p className="text-xs font-bold text-white/60" aria-live="polite">
                Imagem {selectedIndex + 1} de {activeItems.length}
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate(-1)}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-white/20 px-3 text-xs font-extrabold transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(1)}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-white/20 px-3 text-xs font-extrabold transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Próxima
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </aside>
        </Dialog.Content>
      ) : null}
    </Dialog.Portal>
  );
}
