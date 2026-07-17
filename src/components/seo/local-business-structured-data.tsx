import { faqItems } from "@/lib/faq-data";
import { landingPageData } from "@/lib/landing-page-data";
import { absoluteSiteUrl, siteConfig } from "@/lib/site-config";

function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function LocalBusinessStructuredData() {
  const businessId = `${siteConfig.siteUrl}/#business`;
  const professionalId = `${siteConfig.siteUrl}/#kesia-dutra`;
  const services = landingPageData.services.items.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service.name,
      description: service.description,
      provider: { "@id": businessId },
      areaServed: {
        "@type": "City",
        name: siteConfig.city,
      },
    },
  }));
  const activeFaqItems = faqItems.filter((item) => item.active);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.siteUrl}/#website`,
        url: absoluteSiteUrl(),
        name: siteConfig.name,
        inLanguage: siteConfig.language,
        publisher: { "@id": businessId },
      },
      {
        "@type": "WebPage",
        "@id": `${siteConfig.siteUrl}/#webpage`,
        url: absoluteSiteUrl(),
        name: landingPageData.seo.title,
        description: landingPageData.seo.description,
        isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
        about: { "@id": businessId },
        inLanguage: siteConfig.language,
      },
      {
        "@type": "HairSalon",
        "@id": businessId,
        name: siteConfig.name,
        url: absoluteSiteUrl(),
        image: absoluteSiteUrl(siteConfig.ogImagePath),
        telephone: siteConfig.telephone,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.streetAddress,
          addressLocality: siteConfig.city,
          addressRegion: siteConfig.state,
          addressCountry: siteConfig.country,
        },
        areaServed: {
          "@type": "City",
          name: siteConfig.city,
        },
        sameAs: [siteConfig.instagramUrl],
        founder: { "@id": professionalId },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Serviços de cabelo e penteados",
          itemListElement: services,
        },
      },
      {
        "@type": "Person",
        "@id": professionalId,
        name: siteConfig.professionalName,
        jobTitle: "Cabeleireira e especialista em penteados",
        worksFor: { "@id": businessId },
        sameAs: [siteConfig.instagramUrl],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteConfig.siteUrl}/#faq`,
        mainEntity: activeFaqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(graph) }}
    />
  );
}
