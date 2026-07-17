import Link from "next/link";
import {
  ArrowRight,
  Camera,
  MapPin,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { clsx } from "clsx";
import { BrandLogo } from "@/components/brand/brand-logo";

type SiteFooterProps = {
  businessName: string;
  professionalName: string;
  description: string;
  whatsappPhone: string;
  whatsappDisplay: string;
  instagramHandle: string;
  instagramUrl: string;
  address: string;
  nunitoClassName: string;
};

type FooterContact = {
  id: "whatsapp" | "instagram" | "location";
  label: string;
  value: string;
  icon: LucideIcon;
  href?: string;
};

const whatsappMessage =
  "Olá! Gostaria de agendar um horário com a Késia Dutra Cabeleireira.";

function buildWhatsAppHref(phone: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
}

export function SiteFooter({
  businessName,
  professionalName,
  description,
  whatsappPhone,
  whatsappDisplay,
  instagramHandle,
  instagramUrl,
  address,
  nunitoClassName,
}: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const contacts: FooterContact[] = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: whatsappDisplay,
      icon: MessageCircle,
      href: buildWhatsAppHref(whatsappPhone),
    },
    {
      id: "instagram",
      label: "Instagram",
      value: instagramHandle,
      icon: Camera,
      href: instagramUrl,
    },
    {
      id: "location",
      label: "Endereço",
      value: address,
      icon: MapPin,
    },
  ];

  return (
    <footer
      className={clsx(
        nunitoClassName,
        "site-footer bg-[var(--color-background)] px-6 pb-9 pt-[72px] text-[var(--color-text-strong)] md:px-10 md:pb-11 md:pt-[88px] xl:px-[clamp(48px,5vw,88px)] xl:pt-[108px]",
      )}
    >
      <div className="mx-auto max-w-[1700px]">
        <div className="site-footer-main">
          <FooterBrand businessName={businessName} />
          <div className="site-footer-information">
            <p className="max-w-[680px] text-base font-semibold leading-7 text-[var(--color-text-muted)] sm:text-lg">
              {description}
            </p>
            <FooterContactLinks contacts={contacts} />
          </div>
        </div>

        <FooterLegal currentYear={currentYear} professionalName={professionalName} />
      </div>
    </footer>
  );
}

function FooterBrand({ businessName }: { businessName: string }) {
  return (
    <div className="site-footer-brand">
      <BrandLogo alt={businessName} className="h-auto w-full max-w-[290px]" />
    </div>
  );
}

function FooterContactLinks({ contacts }: { contacts: FooterContact[] }) {
  return (
    <nav aria-label="Contatos" className="site-footer-contacts">
      {contacts.map((contact) => {
        const Icon = contact.icon;
        const content = (
          <>
            <Icon className="size-5 shrink-0" strokeWidth={1.55} aria-hidden="true" />
            <span>
              {contact.id === "location" ? null : (
                <span className="font-extrabold">{contact.label}: </span>
              )}
              {contact.value}
            </span>
          </>
        );

        return (
          <span key={contact.id} className="site-footer-contact-item">
            {contact.href ? (
              <a
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-contact-link"
              >
                {content}
              </a>
            ) : (
              <span aria-label={`${contact.label}: ${contact.value}`} className="site-footer-contact-static">
                {content}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function FooterLegal({
  currentYear,
  professionalName,
}: {
  currentYear: number;
  professionalName: string;
}) {
  return (
    <div className="site-footer-legal">
      <p>© {currentYear} {professionalName}. Todos os direitos reservados.</p>
      <Link
        prefetch={false}
        href="/login"
        className="group inline-flex min-h-11 items-center gap-1.5 text-[var(--color-brand-primary)] transition-colors duration-200 hover:text-[var(--color-brand-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand-primary)]"
      >
        Área administrativa
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
