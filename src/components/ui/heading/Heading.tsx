import * as React from "react";

import { cn } from "@/utils/cn";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: "display-lg" | "headline-md" | "body-lg" | "label-caps";
  subheading?: React.ReactNode;
  children: React.ReactNode;
}

export default function Heading({
  level = 2,
  variant = "headline-md",
  subheading,
  className = "",
  children,
  ...props
}: HeadingProps): React.JSX.Element {
  const Tag = `h${String(level)}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  const variants = {
    "display-lg":
      "font-display-lg text-3xl sm:text-5xl font-extrabold tracking-tight text-app-fg mb-1",
    "headline-md":
      "font-headline-md text-xl sm:text-2xl font-bold tracking-tight text-app-fg mb-1",
    "body-lg": "font-body-lg text-base sm:text-lg text-app-fg mb-0.5",
    "label-caps":
      "font-label-caps text-[10px] font-bold text-app-fg uppercase tracking-wider mb-0.5",
  };

  if (subheading !== undefined && subheading !== null && subheading !== "") {
    return (
      <div className="flex flex-col gap-1">
        <Tag className={cn(variants[variant], className)} {...props}>
          {children}
        </Tag>
        <p className="text-xs sm:text-sm text-app-muted font-body-md leading-relaxed">
          {subheading}
        </p>
      </div>
    );
  }

  return (
    <Tag className={cn(variants[variant], className)} {...props}>
      {children}
    </Tag>
  );
}
