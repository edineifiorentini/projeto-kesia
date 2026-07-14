import type { ElementType, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Nunito_Sans } from "next/font/google";
import {
  CalendarCheck2,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";
import { clsx } from "clsx";
import { AboutKesiaSection } from "@/components/landing/about-kesia-section";
import { ExperienceSection } from "@/components/landing/experience-section";
import { ScrollHeroExperience } from "@/components/landing/scroll-hero-experience";
import { ServicesSection } from "@/components/landing/services-section";
import { landingPageData } from "@/lib/landing-page-data";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const d = landingPageData;

const images = {
  hero:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=86",
  salon:
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=86",
  bride:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=86",
  debutante:
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1000&q=86",
  party:
    "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=1000&q=86",
  brush:
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=86",
  final:
    "https://images.unsplash.com/photo-1522336284037-91f7da073525?auto=format&fit=crop&w=1000&q=86",
} as const;

const audienceCards = [
  {
    number: "// 01",
    title: "Noivas",
    description:
      "Para quem deseja um penteado elegante, resistente e alinhado ao vestido, maquiagem e cerimônia.",
  },
  {
    number: "// 02",
    title: "Debutantes",
    description:
      "Para quem quer uma produção especial, jovem, marcante e cheia de personalidade.",
  },
  {
    number: "// 03",
    title: "Festas e eventos",
    description:
      "Para formaturas, casamentos, aniversários, ensaios e ocasiões em que você quer se sentir ainda mais bonita.",
  },
] as const;

const galleryItems = [
  { image: images.bride, alt: "Penteado elegante para noiva", label: "Noivas" },
  { image: images.debutante, alt: "Penteado para debutante", label: "Debutantes" },
  { image: images.party, alt: "Penteado para festa", label: "Festas" },
  { image: images.brush, alt: "Escova modelada", label: "Escova" },
  { image: images.final, alt: "Finalização com ondas", label: "Finalização" },
  { image: images.salon, alt: "Cuidado em salão de beleza", label: "Coloração" },
] as const;

const testimonials = [
  {
    name: "Cliente Noiva",
    service: "Penteado para noiva",
    quote:
      "Meu penteado ficou exatamente como eu sonhava. Me senti linda e segura durante todo o evento.",
  },
  {
    name: "Cliente Debutante",
    service: "Penteado para debutante",
    quote:
      "O atendimento foi acolhedor do começo ao fim, e o penteado durou a festa inteira.",
  },
  {
    name: "Cliente Festa",
    service: "Produção para festa",
    quote:
      "Fui muito bem atendida e saí pronta para o evento com um visual elegante.",
  },
] as const;

const bookingSteps = [
  "Escolha o serviço",
  "Defina profissional e horário",
  "Informe seus dados",
  "Confirme pelo WhatsApp",
] as const;

function whatsappHref(message?: string) {
  const text =
    message ??
    "Olá! Gostaria de agendar um horário com a Késia Dutra Cabeleireira.";
  return `https://wa.me/${d.whatsappPhone}?text=${encodeURIComponent(text)}`;
}

function SmartLink({
  href,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

function PrimaryButton({
  href,
  children,
  icon: Icon = CalendarCheck2,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  icon?: ElementType;
  variant?: "primary" | "secondary" | "light";
  className?: string;
}) {
  return (
    <SmartLink
      href={href}
      className={clsx(
        "inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-sm font-extrabold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "hover:-translate-y-0.5",
        variant === "primary" &&
          "bg-[#B94A2F] text-white shadow-[0_10px_24px_rgba(143,56,37,0.18)] hover:bg-[#8F3825] focus-visible:outline-[#B94A2F]",
        variant === "secondary" &&
          "border border-[#B94A2F] bg-transparent text-[#B94A2F] hover:bg-[#FFF9F3] focus-visible:outline-[#B94A2F]",
        variant === "light" &&
          "bg-white text-[#8F3825] hover:bg-[#FAF5EF] focus-visible:outline-white",
        className,
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {children}
    </SmartLink>
  );
}

function SectionTag({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={clsx(
        "inline-flex rounded-md border px-4 py-2 text-xs font-extrabold uppercase tracking-normal",
        light
          ? "border-white/45 text-white"
          : "border-[#B94A2F] text-[#B94A2F]",
      )}
    >
      {children}
    </p>
  );
}

function SectionHeader({
  tag,
  title,
  subtitle,
  align = "left",
  light = false,
}: {
  tag: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={clsx("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <SectionTag light={light}>{tag}</SectionTag>
      <h2
        className={clsx(
          fraunces.className,
          "mt-5 text-[34px] font-black leading-[1.05] tracking-normal sm:text-5xl",
          light ? "text-white" : "text-[#5F4B43]",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={clsx(
            "mt-4 text-base font-semibold leading-7 sm:text-lg",
            light ? "text-white/76" : "text-[#7A655C]",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function AudienceSection() {
  return (
    <section className="bg-[#F4E8DA] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <SectionHeader
            tag="// Para quem é"
            title="Atendimentos para quem quer se sentir segura, bonita e bem cuidada."
            subtitle="Cada ocasião pede um cuidado diferente. Por isso, o atendimento é personalizado para o seu momento."
          />
          <div className="mt-9 grid gap-4">
            {audienceCards.map((card) => (
              <article
                key={card.number}
                className="rounded-lg bg-[#FFFDF9] p-5 ring-1 ring-[#E4D2C3]"
              >
                <p className="text-xs font-extrabold uppercase tracking-normal text-[#B94A2F]">
                  {card.number}
                </p>
                <h3 className={clsx(fraunces.className, "mt-3 text-2xl font-black text-[#5F4B43]")}>
                  {card.title}
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#7A655C]">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
          <PrimaryButton href={d.bookingPath} className="mt-8 w-full sm:w-auto">
            Quero escolher meu horário
          </PrimaryButton>
        </div>

        <div className="overflow-hidden rounded-t-[96px] rounded-b-lg bg-[#D7BDA6]">
          <Image
            src={images.bride}
            alt="Atendimento personalizado para penteado de evento"
            width={720}
            height={920}
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  return (
    <section id="galeria" className="bg-[#FFFDF9] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeader
          tag="// Penteados"
          title="Belezas reais, momentos inesquecíveis."
          subtitle="Veja algumas inspirações de produções para noivas, debutantes, festas e eventos."
          align="center"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <figure
              key={`${item.label}-${index}`}
              className="group overflow-hidden rounded-lg bg-[#FFF9F3] ring-1 ring-[#E4D2C3]"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={720}
                  height={860}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="flex items-center justify-between p-4 text-sm font-extrabold text-[#5F4B43]">
                {item.label}
                <Sparkles className="size-4 text-[#B94A2F]" aria-hidden="true" />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="bg-[#F4E8DA] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            tag="// Depoimentos"
            title="Histórias reais de quem já viveu essa experiência."
            subtitle="Feedbacks de clientes que confiaram seu momento especial aos nossos cuidados."
          />
          <PrimaryButton
            href={whatsappHref("Olá! Quero viver essa experiência com a Késia Dutra.")}
            icon={MessageCircle}
            variant="secondary"
            className="w-full md:w-auto"
          >
            Quero viver essa experiência
          </PrimaryButton>
        </div>
        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.service}
              className="min-w-[280px] max-w-sm snap-start rounded-lg bg-[#FFFDF9] p-6 ring-1 ring-[#E4D2C3] sm:min-w-[360px]"
            >
              <div className="flex gap-1 text-[#B94A2F]" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star key={item} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-5 text-base font-semibold leading-7 text-[#5F4B43]">
                “{testimonial.quote}”
              </p>
              <div className="mt-6 border-t border-[#E4D2C3] pt-4">
                <p className="text-sm font-extrabold text-[#5F4B43]">
                  {testimonial.name}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-normal text-[#B94A2F]">
                  {testimonial.service}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OnlineBookingSection() {
  return (
    <section id="agendamento" className="bg-[#FFFDF9] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1180px] gap-8 rounded-lg border border-[#E4D2C3] bg-[#FFF9F3] p-5 shadow-[0_20px_60px_rgba(95,75,67,0.08)] sm:p-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <SectionHeader
            tag="// Agendamento"
            title="Escolha seu horário no sistema online."
            subtitle="O fluxo de agendamento já está pronto para selecionar serviço, profissional e horário disponível."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href={d.bookingPath} className="w-full sm:w-auto">
              Abrir agendamento online
            </PrimaryButton>
            <PrimaryButton
              href={whatsappHref()}
              icon={MessageCircle}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Falar no WhatsApp
            </PrimaryButton>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {bookingSteps.map((step, index) => (
            <div key={step} className="rounded-lg bg-[#FFFDF9] p-5 ring-1 ring-[#E4D2C3]">
              <p className="text-xs font-extrabold text-[#B94A2F]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 text-base font-extrabold text-[#5F4B43]">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="bg-[#FAF5EF] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1120px] overflow-hidden rounded-lg border border-[#E4D2C3] bg-[#FFFDF9] shadow-[0_20px_60px_rgba(95,75,67,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="p-7 sm:p-10 lg:p-12">
          <SectionTag>{"// Agende"}</SectionTag>
          <h2
            className={clsx(
              fraunces.className,
              "mt-5 text-[34px] font-black leading-[1.05] tracking-normal text-[#5F4B43] sm:text-5xl",
            )}
          >
            Sua próxima produção começa aqui.
          </h2>
          <p className="mt-5 text-base font-semibold leading-8 text-[#7A655C]">
            Agende seu horário e viva uma experiência de beleza pensada para o
            seu estilo, seu momento e sua história.
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-lg bg-[#F4E8DA] p-4 text-sm font-bold leading-6 text-[#5F4B43]">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#B94A2F]" aria-hidden="true" />
            Atendimento com horário marcado para garantir cuidado, atenção e
            tranquilidade.
          </div>
          <PrimaryButton href={d.bookingPath} className="mt-8 w-full sm:w-auto">
            Entrar no agendamento online
          </PrimaryButton>
        </div>
        <Image
          src={images.final}
          alt="Mulher com cabelo finalizado em salão de beleza"
          width={900}
          height={760}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-[320px] w-full object-cover lg:h-full"
        />
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="bg-[#F4E8DA] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[920px]">
        <SectionHeader
          tag="// Dúvidas"
          title="Perguntas frequentes"
          subtitle="Veja as principais dúvidas antes de agendar seu atendimento."
          align="center"
        />
        <div className="mt-10 grid gap-4">
          {d.faq.questions.map((item) => (
            <details
              key={item.question}
              className="group rounded-lg bg-[#FFFDF9] p-5 ring-1 ring-[#E4D2C3]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-extrabold text-[#5F4B43]">
                {item.question}
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#F4E8DA] text-[#B94A2F] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm font-semibold leading-7 text-[#7A655C]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#FFFDF9] px-5 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1180px] gap-8 text-center">
        <div>
          <p className={clsx(fraunces.className, "text-3xl font-black text-[#5F4B43]")}>
            {d.businessName}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#7A655C]">
            Sua beleza merece ser cuidada com carinho, técnica e intenção.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryButton href={d.bookingPath}>Agendar atendimento</PrimaryButton>
          <PrimaryButton
            href={whatsappHref()}
            icon={MessageCircle}
            variant="secondary"
          >
            Chamar no WhatsApp
          </PrimaryButton>
        </div>
        <div className="mx-auto grid gap-2 text-sm font-bold text-[#7A655C] sm:grid-cols-3">
          <p>WhatsApp: {d.whatsappDisplay}</p>
          <p>Instagram: {d.instagram}</p>
          <p>Endereço: {d.address}</p>
        </div>
        <div className="border-t border-[#E4D2C3] pt-5 text-xs font-bold text-[#9B7B6B]">
          <p>{d.footer.legalText}</p>
          <Link href="/login" className="mt-3 inline-flex underline-offset-4 hover:underline">
            Área administrativa
          </Link>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppFloatingButton() {
  return (
    <a
      data-floating-whatsapp
      href={whatsappHref()}
      target="_blank"
      rel="noreferrer"
      className="pointer-events-none fixed bottom-5 right-5 z-40 inline-flex size-13 items-center justify-center rounded-full bg-[#1FA855] text-white opacity-0 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#168744] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1FA855]"
      aria-label="Falar pelo WhatsApp"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </a>
  );
}

export function LandingPage() {
  return (
    <main className={clsx(nunitoSans.className, "min-h-screen bg-[#F4E8DA] text-[#5F4B43]")}>
      <ScrollHeroExperience
        bookingPath={d.bookingPath}
        frauncesClassName={fraunces.className}
        nunitoClassName={nunitoSans.className}
      />
      <ExperienceSection
        frauncesClassName={fraunces.className}
        nunitoClassName={nunitoSans.className}
      />
      <AboutKesiaSection
        frauncesClassName={fraunces.className}
        nunitoClassName={nunitoSans.className}
      />
      <ServicesSection
        frauncesClassName={fraunces.className}
        nunitoClassName={nunitoSans.className}
        whatsappPhone={d.whatsappPhone}
      />
      <AudienceSection />
      <GallerySection />
      <TestimonialsSection />
      <OnlineBookingSection />
      <FinalCTASection />
      <FAQSection />
      <Footer />
      <WhatsAppFloatingButton />
    </main>
  );
}
