import * as React from "react";

import { cn } from "@/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({
  className = "",
  children,
  ...props
}: CardProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "bg-app-surface/80 border border-app-card-border backdrop-blur-lg rounded-2xl p-8 transition-all duration-350 ease-out hover:-translate-y-1 hover:shadow-[0_24px_45px_-10px_rgba(0,0,0,0.06)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
