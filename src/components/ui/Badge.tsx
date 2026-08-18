import * as React from "react";

import { cn } from "@/lib/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "emerald" | "sky" | "amber" | "rose" | "muted" | undefined;
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  brand: "bg-app-brand-bg text-app-brand border-app-brand/30",
  emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  sky: "bg-sky-500/10 text-sky-600 border-sky-500/30",
  amber: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  rose: "bg-rose-500/10 text-rose-600 border-rose-500/30",
  muted: "bg-app-surface-variant text-app-muted border-app-border/40",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "brand", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
