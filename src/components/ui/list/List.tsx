import * as React from "react";

import { cn } from "@/utils/cn";

export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function List({
  className = "",
  children,
  ...props
}: ListProps): React.JSX.Element {
  return (
    <div className={cn("flex flex-col w-full", className)} {...props}>
      {children}
    </div>
  );
}

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ListItem({
  className = "",
  children,
  ...props
}: ListItemProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-4.5 border-b border-app-fg/5 last:border-0 transition-colors duration-250 hover:bg-app-fg/2 px-2 rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
