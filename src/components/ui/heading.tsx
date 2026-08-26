import * as React from "react";

import { cn } from "@/lib/utils/cn";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6 | undefined;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | undefined;
}

const sizeClasses: Record<NonNullable<HeadingProps["size"]>, string> = {
  sm: "text-xs sm:text-sm font-semibold tracking-tight",
  md: "text-sm sm:text-base font-bold tracking-tight",
  lg: "text-base sm:text-lg font-bold tracking-tight",
  xl: "text-lg sm:text-xl font-bold tracking-tight",
  "2xl": "text-xl sm:text-2xl font-bold tracking-tight",
};

const tagMap: Record<number, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, size = "md", children, ...props }, ref) => {
    const Component = tagMap[level] ?? "h2";

    return (
      <Component
        ref={ref}
        className={cn("text-app-fg", sizeClasses[size], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";

export default Heading;
