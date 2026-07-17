import Image from "next/image";
import { clsx } from "clsx";

type BrandLogoProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
};

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const brandLogoSrc = `${publicBasePath}/images/brand/kesia-dutra-logo-outlined.svg`;

export function BrandLogo({ alt = "Késia Dutra", className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src={brandLogoSrc}
      alt={alt}
      width={600}
      height={166}
      priority={priority}
      unoptimized
      draggable={false}
      className={clsx("object-contain", className ?? "h-auto w-full")}
    />
  );
}
