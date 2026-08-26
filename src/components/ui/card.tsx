import * as React from "react";

import { cn } from "@/lib/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "interactive" | undefined;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-6 transition-all duration-300",
          variant === "default" &&
            "bg-app-surface border border-app-border/40 shadow-xl shadow-black/5",
          variant === "glass" &&
            "bg-app-surface/60 backdrop-blur-xl border border-app-border/30 shadow-2xl",
          variant === "interactive" &&
            "bg-app-surface border border-app-border/40 hover:border-app-brand/40 hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
