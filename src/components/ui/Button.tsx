import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  isLoading?: boolean | undefined;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-app-brand text-white hover:brightness-110 shadow-sm shadow-app-brand/20 active:scale-[0.98]",
  secondary:
    "bg-app-surface-variant text-app-fg hover:bg-app-border/40 active:scale-[0.98]",
  outline:
    "border border-app-border/80 bg-transparent text-app-fg hover:bg-app-surface-variant hover:border-app-brand/40 active:scale-[0.98]",
  ghost: "bg-transparent text-app-muted hover:text-app-fg hover:bg-app-surface-variant",
  danger:
    "bg-app-error text-white hover:brightness-110 shadow-sm shadow-app-error/20 active:scale-[0.98]",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm font-semibold rounded-xl gap-2",
  lg: "px-6 py-3.5 text-base font-bold rounded-xl gap-2.5",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled ?? isLoading}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed disabled:pointer-events-none select-none whitespace-nowrap",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center justify-center gap-2 w-full">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span className="inline-flex items-center justify-center gap-1.5">
              {children}
            </span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
