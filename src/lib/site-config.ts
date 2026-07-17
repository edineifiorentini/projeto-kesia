import { landingPageData } from "@/lib/landing-page-data";

const fallbackSiteUrl = "https://edineifiorentini.github.io/projeto-kesia";

export const siteConfig = {
  name: landingPageData.businessName,
  professionalName: landingPageData.professionalName,
  description: landingPageData.seo.description,
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl).replace(/\/$/, ""),
  locale: "pt_BR",
  language: "pt-BR",
  region: "BR-PR",
  city: "Cruzeiro do Oeste",
  state: "PR",
  country: "BR",
  streetAddress: "Rua Cantú, 62",
  telephone: "+55 44 99702-8313",
  whatsapp: landingPageData.whatsappPhone,
  instagramUrl: landingPageData.instagramUrl,
  instagramHandle: landingPageData.instagram,
  ogImagePath: "/videos/hero-kesia-poster-hq.webp",
} as const;

export function absoluteSiteUrl(path = "") {
  if (!path || path === "/") {
    return `${siteConfig.siteUrl}/`;
  }

  return `${siteConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function publicAssetPath(path: string) {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${basePath}${normalizedPath}`;
}
