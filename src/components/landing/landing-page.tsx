import { Fraunces, Nunito_Sans } from "next/font/google";
import { MessageCircle } from "lucide-react";
import { clsx } from "clsx";
import { AboutKesiaSection } from "@/components/landing/about-kesia-section";
import { BookingSection } from "@/components/landing/booking-section";
import { ExperienceSection } from "@/components/landing/experience-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FinalBookingCTASection } from "@/components/landing/final-booking-cta-section";
import { MomentsSection } from "@/components/landing/moments-section";
import { PortfolioSection } from "@/components/landing/portfolio-section";
import { ScrollHeroExperience } from "@/components/landing/scroll-hero-experience";
import { ServicesSection } from "@/components/landing/services-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { TabTitleRotator } from "@/components/landing/tab-title-rotator";
import { WhatsAppTestimonialsSection } from "@/components/landing/whatsapp-testimonials-section";
import { landingPageData } from "@/lib/landing-page-data";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const d = landingPageData;

function whatsappHref(message?: string) {
  const text =
    message ??
    "Olá! Gostaria de agendar um horário com a Késia Dutra Cabeleireira.";
  return `https://wa.me/${d.whatsappPhone}?text=${encodeURIComponent(text)}`;
}

function WhatsAppFloatingButton() {
  return (
    <a
      data-floating-whatsapp
      href={whatsappHref()}
      target="_blank"
      rel="noreferrer"
      className="pointer-events-none fixed bottom-5 right-5 z-40 inline-flex size-13 items-center justify-center rounded-full bg-[var(--color-success)] text-white opacity-0 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[var(--color-success)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-success)]"
      aria-label="Falar pelo WhatsApp"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </a>
  );
}

export function LandingPage() {
  return (
    <main className={clsx(nunitoSans.className, "min-h-screen bg-[var(--color-background)] text-[var(--color-text)]")}>
      <TabTitleRotator />
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
      <MomentsSection
        frauncesClassName={fraunces.className}
        nunitoClassName={nunitoSans.className}
        whatsappPhone={d.whatsappPhone}
      />
      <PortfolioSection
        bookingPath={d.bookingPath}
        frauncesClassName={fraunces.className}
        nunitoClassName={nunitoSans.className}
      />
      <WhatsAppTestimonialsSection
        frauncesClassName={fraunces.className}
        nunitoClassName={nunitoSans.className}
        whatsappPhone={d.whatsappPhone}
      />
      <BookingSection
        bookingPath={d.bookingPath}
        frauncesClassName={fraunces.className}
        nunitoClassName={nunitoSans.className}
        whatsappPhone={d.whatsappPhone}
      />
      <FinalBookingCTASection
        bookingPath={d.bookingPath}
        frauncesClassName={fraunces.className}
        nunitoClassName={nunitoSans.className}
        whatsappPhone={d.whatsappPhone}
      />
      <FAQSection
        frauncesClassName={fraunces.className}
        nunitoClassName={nunitoSans.className}
        whatsappPhone={d.whatsappPhone}
      />
      <SiteFooter
        businessName={d.businessName}
        professionalName={d.professionalName}
        description={d.footer.description}
        whatsappPhone={d.whatsappPhone}
        whatsappDisplay={d.whatsappDisplay}
        instagramHandle={d.instagram}
        instagramUrl={d.instagramUrl}
        address={d.address}
        nunitoClassName={nunitoSans.className}
      />
      <WhatsAppFloatingButton />
    </main>
  );
}
