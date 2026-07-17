import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { LocalBusinessStructuredData } from "@/components/seo/local-business-structured-data";
import { landingPageData } from "@/lib/landing-page-data";
import { absoluteSiteUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: landingPageData.seo.title,
  description: landingPageData.seo.description,
  alternates: { canonical: absoluteSiteUrl() },
  openGraph: {
    url: absoluteSiteUrl(),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    title: landingPageData.seo.title,
    description: landingPageData.seo.description,
    images: [absoluteSiteUrl(siteConfig.ogImagePath)],
  },
};

export default function HomePage() {
  return (
    <>
      <LocalBusinessStructuredData />
      <LandingPage />
    </>
  );
}
