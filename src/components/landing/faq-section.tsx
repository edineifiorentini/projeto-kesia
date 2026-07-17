"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, Headset, MessageCircle, Plus, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { faqItems, type FAQItemData } from "@/lib/faq-data";
import { PremiumAction } from "@/components/ui/premium-action";

type FAQSectionProps = {
  frauncesClassName: string;
  nunitoClassName: string;
  whatsappPhone: string;
};

type FAQAccordionProps = {
  items: FAQItemData[];
  entered: boolean;
  frauncesClassName: string;
  reducedMotion: boolean;
};

const supportMessage =
  "Olá, Késia! Tenho uma dúvida sobre o atendimento e gostaria de conversar.";
const entranceEase = [0.22, 1, 0.36, 1] as const;

function buildWhatsAppHref(phone: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(supportMessage)}`;
}

export function FAQSection({
  frauncesClassName,
  nunitoClassName,
  whatsappPhone,
}: FAQSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.18 });
  const reducedMotion = useReducedMotion() ?? false;
  const entered = isInView || reducedMotion;
  const activeItems = faqItems.filter((item) => item.active);

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-labelledby="faq-title"
      className={clsx(
        nunitoClassName,
        "relative overflow-clip bg-[var(--color-surface)] px-6 py-[92px] text-[var(--color-text-strong)] max-[359px]:px-5 md:px-10 md:py-[118px] xl:px-[clamp(48px,5vw,88px)] xl:py-[clamp(120px,9vw,180px)]",
      )}
    >
      <span id="duvidas" className="pointer-events-none absolute left-0 top-0" aria-hidden="true" />
      <FAQStructuredData items={activeItems} />

      <div className="faq-editorial-grid mx-auto max-w-[1700px]">
        <FAQIntro
          entered={entered}
          frauncesClassName={frauncesClassName}
          reducedMotion={reducedMotion}
        />
        <FAQAccordion
          items={activeItems}
          entered={entered}
          frauncesClassName={frauncesClassName}
          reducedMotion={reducedMotion}
        />
        <FAQSupportBlock
          entered={entered}
          href={buildWhatsAppHref(whatsappPhone)}
          reducedMotion={reducedMotion}
        />
      </div>
    </section>
  );
}

function FAQIntro({
  entered,
  frauncesClassName,
  reducedMotion,
}: {
  entered: boolean;
  frauncesClassName: string;
  reducedMotion: boolean;
}) {
  const reveal = (delay: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 16 },
    animate: entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: reducedMotion
      ? { duration: 0 }
      : { duration: 0.68, delay, ease: entranceEase },
  });

  return (
    <div className="faq-intro max-w-[640px]">
      <motion.p
        {...reveal(0)}
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--color-brand-primary-border)] px-4 text-xs font-extrabold uppercase text-[var(--color-brand-primary)]"
      >
        <span aria-hidden="true">{"//"}</span>
        Dúvidas
      </motion.p>

      <h2
        id="faq-title"
        aria-label="Tudo o que você precisa saber antes do seu momento."
        className={clsx(
          frauncesClassName,
          "mt-8 text-[34px] font-normal leading-[0.96] tracking-normal text-[var(--color-text-strong)] min-[375px]:text-[38px] sm:text-[52px] lg:text-[60px] xl:text-[46px] min-[1440px]:text-[54px] min-[1800px]:text-[64px]",
        )}
      >
        {[
          "Tudo o que você",
          "precisa saber antes",
          "do seu momento.",
        ].map((line, index) => (
          <span key={line} className="block overflow-hidden pb-1" aria-hidden="true">
            <motion.span
              className="block"
              initial={reducedMotion ? false : { opacity: 0, y: "105%" }}
              animate={
                entered ? { opacity: 1, y: "0%" } : { opacity: 0, y: "105%" }
              }
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.92,
                      delay: 0.08 + index * 0.1,
                      ease: entranceEase,
                    }
              }
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h2>

      <motion.p
        {...reveal(0.38)}
        className="mt-8 max-w-[460px] text-base font-semibold leading-7 text-[var(--color-text-muted)] sm:text-lg sm:leading-8"
      >
        Respostas para você agendar com mais segurança, clareza e tranquilidade.
      </motion.p>
    </div>
  );
}

function FAQSupportBlock({
  entered,
  href,
  reducedMotion,
}: {
  entered: boolean;
  href: string;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className="faq-support max-w-[470px]"
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: 0.72, delay: 0.5, ease: entranceEase }
      }
    >
      <div className="flex items-center gap-5">
        <span className="grid size-[74px] shrink-0 place-items-center rounded-full border border-[var(--color-brand-primary-border)] text-[var(--color-brand-primary)]">
          <Headset className="size-8" strokeWidth={1.35} aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-base font-extrabold text-[var(--color-text-strong)]">
            Sua dúvida não está aqui?
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-text-muted)] sm:text-base">
            Fale diretamente com a Késia e receba uma orientação personalizada.
          </p>
        </div>
      </div>

      <PremiumAction asChild size="md" className="mt-7">
        <a href={href} target="_blank" rel="noreferrer">
          <MessageCircle data-premium-leading aria-hidden="true" />
          <span>Falar com a Késia</span>
          <ArrowRight data-premium-arrow aria-hidden="true" />
        </a>
      </PremiumAction>
    </motion.div>
  );
}

function FAQAccordion({
  items,
  entered,
  frauncesClassName,
  reducedMotion,
}: FAQAccordionProps) {
  const [activeId, setActiveId] = useState<FAQItemData["id"] | null>(
    "bridal-trial",
  );

  return (
    <div className="faq-accordion relative">
      <span className="faq-divider-sparkle" aria-hidden="true">
        <Sparkles className="size-5" strokeWidth={1.2} />
      </span>
      <ul className="list-none" aria-label="Perguntas frequentes">
        {items.map((item, index) => (
          <FAQItem
            key={item.id}
            item={item}
            index={index}
            isOpen={activeId === item.id}
            entered={entered}
            frauncesClassName={frauncesClassName}
            reducedMotion={reducedMotion}
            onToggle={() => setActiveId((current) => (current === item.id ? null : item.id))}
          />
        ))}
      </ul>
    </div>
  );
}

function FAQItem({
  item,
  index,
  isOpen,
  entered,
  frauncesClassName,
  reducedMotion,
  onToggle,
}: {
  item: FAQItemData;
  index: number;
  isOpen: boolean;
  entered: boolean;
  frauncesClassName: string;
  reducedMotion: boolean;
  onToggle: () => void;
}) {
  const buttonId = `faq-question-${item.id}`;
  const panelId = `faq-answer-${item.id}`;
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <motion.li
      layout={reducedMotion ? false : "position"}
      className={clsx("faq-item relative", isOpen && "faq-item-open")}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: 0.58, delay: 0.16 + index * 0.075, ease: entranceEase }
      }
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        className="faq-accordion-button group"
      >
        <span className="faq-number">{item.number}</span>
        <span className={clsx(frauncesClassName, "faq-question")}>{item.question}</span>
        <motion.span
          className="faq-toggle-icon"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.3, ease: entranceEase }}
          aria-hidden="true"
        >
          <Plus className="size-6" strokeWidth={1.35} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reducedMotion ? { opacity: 1 } : { height: 0, opacity: 0, y: -6 }}
            animate={reducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0, y: -4 }}
            transition={
              reducedMotion
                ? { duration: 0.01 }
                : { duration: 0.38, ease: entranceEase }
            }
            className="overflow-hidden"
          >
            <p className="faq-answer-inner">{item.answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.span
        className="faq-item-divider"
        initial={reducedMotion ? false : { scaleX: 0 }}
        animate={entered ? { scaleX: 1 } : { scaleX: 0 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.66, delay: 0.22 + index * 0.075, ease: entranceEase }
        }
        aria-hidden="true"
      />
    </motion.li>
  );
}

function FAQStructuredData({ items }: { items: FAQItemData[] }) {
  const approvedItems = items.filter((item) => !item.temporaryBusinessRule);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: approvedItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
