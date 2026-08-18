import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  isLoading?: boolean | undefined;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  const baseStyle =
    "inline-flex items-center justify-center font-medium tracking-tight rounded-xl transition-all duration-300 ease-out focus:outline-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none gap-2";

  const variants = {
    primary:
      "bg-app-brand text-white border-0 hover:bg-app-brand-hover active:scale-98 shadow-sm relative before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-white/15 before:rounded-xl",
    secondary:
      "bg-app-surface-variant text-app-fg border border-app-border hover:bg-app-border/40 hover:text-app-fg active:scale-98 shadow-sm",
    outline:
      "bg-transparent text-app-fg border border-app-border hover:bg-app-border/20 active:scale-98",
    ghost: "bg-transparent text-app-fg hover:bg-app-border/10 hover:text-app-fg",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const isButtonDisabled = disabled || isLoading;

  return (
    <button
      disabled={isButtonDisabled}
      className={cn(baseStyle, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading && <Loader2 className={cn("animate-spin shrink-0", iconSizes[size])} />}
      {children}
    </button>
  );
}
