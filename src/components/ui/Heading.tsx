import * as React from "react";

import { cn } from "@/lib/utils/cn";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6 | undefined;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | undefined;
}

const sizeClasses: Record<NonNullable<HeadingProps["size"]>, string> = {
  sm: "text-base font-semibold tracking-tight",
  md: "text-lg font-bold tracking-tight",
  lg: "text-2xl font-bold tracking-tight font-display-lg",
  xl: "text-3xl font-extrabold tracking-tight font-display-lg",
  "2xl": "text-4xl sm:text-5xl font-black tracking-tight font-display-lg",
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
