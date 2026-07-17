import type { Metadata, Viewport } from "next";
import { absoluteSiteUrl, publicAssetPath, siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteSiteUrl()),
  title: {
    default: "Késia Dutra Cabeleireira | Penteados em Cruzeiro do Oeste",
    template: "%s | Késia Dutra",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.professionalName }],
  creator: siteConfig.professionalName,
  publisher: siteConfig.name,
  category: "Beleza e cuidados pessoais",
  keywords: [
    "cabeleireira em Cruzeiro do Oeste",
    "penteado para noiva Cruzeiro do Oeste",
    "penteado para debutante",
    "penteado para festa",
    "escova e coloração",
    "Késia Dutra Cabeleireira",
  ],
  alternates: {
    canonical: absoluteSiteUrl(),
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: absoluteSiteUrl(),
    siteName: siteConfig.name,
    title: "Késia Dutra Cabeleireira | Penteados em Cruzeiro do Oeste",
    description: siteConfig.description,
    images: [
      {
        url: absoluteSiteUrl(siteConfig.ogImagePath),
        width: 1280,
        height: 720,
        alt: "Penteado editorial para noivas por Késia Dutra Cabeleireira",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Késia Dutra Cabeleireira | Penteados em Cruzeiro do Oeste",
    description: siteConfig.description,
    images: [absoluteSiteUrl(siteConfig.ogImagePath)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      {
        url: publicAssetPath("/favicon.ico"),
        type: "image/x-icon",
        sizes: "any",
      },
      {
        url: publicAssetPath("/brand/favicon-primary.svg"),
        type: "image/svg+xml",
      },
      {
        url: publicAssetPath("/brand/favicon-primary.svg"),
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: publicAssetPath("/brand/favicon-alternative.svg"),
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: publicAssetPath("/favicon.ico"),
    apple: [
      {
        url: publicAssetPath("/apple-touch-icon.png"),
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
  manifest: publicAssetPath("/site.webmanifest"),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    "geo.region": siteConfig.region,
    "geo.placename": siteConfig.city,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F0EDE4" },
    { media: "(prefers-color-scheme: dark)", color: "#30231D" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <link
          rel="mask-icon"
          href={publicAssetPath("/brand/favicon-monochrome.svg")}
          color="#974315"
        />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
