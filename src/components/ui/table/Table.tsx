import * as React from "react";

import { cn } from "@/utils/cn";

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export function Table({
  className = "",
  children,
  ...props
}: TableProps): React.JSX.Element {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full text-left text-sm border-collapse", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function TableHeader({
  className = "",
  children,
  ...props
}: TableHeaderProps): React.JSX.Element {
  return (
    <thead
      className={cn(
        "border-b border-app-border/80 text-app-muted font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function TableBody({
  className = "",
  children,
  ...props
}: TableBodyProps): React.JSX.Element {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

export function TableRow({
  className = "",
  children,
  ...props
}: TableRowProps): React.JSX.Element {
  return (
    <tr
      className={cn(
        "border-b border-app-border/30 hover:bg-app-fg/2 transition-colors duration-200 last:border-0",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export interface TableHeadCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export function TableHeadCell({
  className = "",
  children,
  ...props
}: TableHeadCellProps): React.JSX.Element {
  return (
    <th
      className={cn(
        "py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-app-muted",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export function TableCell({
  className = "",
  children,
  ...props
}: TableCellProps): React.JSX.Element {
  return (
    <td className={cn("py-4 px-4 text-app-fg", className)} {...props}>
      {children}
    </td>
  );
}
