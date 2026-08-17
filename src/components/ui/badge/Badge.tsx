import * as React from "react";

import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "muted" | "error";
  children: React.ReactNode;
}

export default function Badge({
  variant = "brand",
  className = "",
  children,
  ...props
}: BadgeProps): React.JSX.Element {
  const variants = {
    brand: "bg-app-brand-bg text-app-brand border border-app-brand/10",
    muted: "bg-app-surface-variant text-app-muted border border-app-border/40",
    error: "bg-app-error-bg text-app-error border border-app-error/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
