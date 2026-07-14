import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const useStaticExport = process.env.NEXT_STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        basePath: "/projeto-kesia",
        assetPrefix: "/projeto-kesia/",
        trailingSlash: true,
        ...(useStaticExport ? { output: "export" as const } : {}),
      }
    : {}),
  images: {
    unoptimized: isGithubPages,
    qualities: [75, 92],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
