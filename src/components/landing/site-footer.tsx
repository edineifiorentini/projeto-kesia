import Link from "next/link";
import {
  ArrowRight,
  Camera,
  MapPin,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { clsx } from "clsx";

type SiteFooterProps = {
  businessName: string;
  professionalName: string;
  description: string;
  whatsappPhone: string;
  whatsappDisplay: string;
  instagramHandle: string;
  instagramUrl: string;
  address: string;
  frauncesClassName: string;
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
  frauncesClassName,
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
        "site-footer bg-[#FBF8F3] px-6 pb-9 pt-[72px] text-[#281F1A] md:px-10 md:pb-11 md:pt-[88px] xl:px-[clamp(48px,5vw,88px)] xl:pt-[108px]",
      )}
    >
      <div className="mx-auto max-w-[1700px]">
        <div className="site-footer-main">
          <FooterBrand
            businessName={businessName}
            professionalName={professionalName}
            frauncesClassName={frauncesClassName}
          />
          <div className="site-footer-information">
            <p className="max-w-[680px] text-base font-semibold leading-7 text-[#746A62] sm:text-lg">
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

function FooterBrand({
  businessName,
  professionalName,
  frauncesClassName,
}: {
  businessName: string;
  professionalName: string;
  frauncesClassName: string;
}) {
  return (
    <div className="site-footer-brand" aria-label={businessName}>
      <p
        className={clsx(
          frauncesClassName,
          "text-[44px] font-normal leading-[0.95] tracking-normal text-[#3B2B24] sm:text-[56px] lg:text-[64px] xl:text-[68px]",
        )}
      >
        <span className="block">{professionalName}</span>
        <span className="block">Cabeleireira</span>
      </p>
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
                aria-label={`${contact.label}: ${contact.value}`}
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
        href="/login"
        className="group inline-flex min-h-11 items-center gap-1.5 text-[#9A5A3F] transition-colors duration-200 hover:text-[#7F432D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B86A47]"
      >
        Área administrativa
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
