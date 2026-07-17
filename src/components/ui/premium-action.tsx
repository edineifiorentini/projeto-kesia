import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type PremiumActionVariant = "outline" | "outlineOnDark" | "solid";
type PremiumActionSize = "sm" | "md" | "lg";

type PremiumActionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  size?: PremiumActionSize;
  variant?: PremiumActionVariant;
};

export function PremiumAction({
  asChild = false,
  children,
  className,
  disabled,
  fullWidth = false,
  loading = false,
  size = "md",
  variant = "outline",
  ...props
}: PremiumActionProps) {
  const Component = asChild ? Slot : "button";
  const unavailable = disabled || loading;

  return (
    <Component
      data-premium-action=""
      data-premium-full-width={fullWidth || undefined}
      data-premium-loading={loading || undefined}
      data-premium-size={size}
      data-premium-variant={variant}
      aria-busy={loading || undefined}
      aria-disabled={asChild && unavailable ? true : undefined}
      disabled={asChild ? undefined : unavailable}
      className={cn("premium-action inline-flex", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
