import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { landingPageData } from "@/lib/landing-page-data";

export const metadata: Metadata = {
  title: landingPageData.seo.title,
  description: landingPageData.seo.description,
  keywords: [
    "penteado para noiva",
    "penteado para debutante",
    "penteado para festa",
    "salão de beleza",
    "escova",
    "tintura",
    "agendamento online",
    "cabeleireira",
  ],
  openGraph: {
    title: landingPageData.seo.title,
    description:
      "Penteados, escova, tintura e finalização com atendimento acolhedor para momentos especiais.",
    images: [landingPageData.hero.image],
  },
};

export default function HomePage() {
  return <LandingPage />;
}
