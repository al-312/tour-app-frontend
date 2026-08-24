import * as React from "react";

import { cn } from "@/lib/utils/cn";

type TableProps = React.TableHTMLAttributes<HTMLTableElement>;

function TableHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element {
  return (
    <thead
      className={cn(
        "bg-app-surface-variant/60 border-b border-app-border/60 text-xs font-semibold uppercase text-app-muted font-label-caps",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

function TableBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element {
  return (
    <tbody className={cn("divide-y divide-app-border/30", className)} {...props}>
      {children}
    </tbody>
  );
}

function TableRow({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>): React.JSX.Element {
  return (
    <tr
      className={cn("transition-colors hover:bg-app-surface-variant/30", className)}
      {...props}
    >
      {children}
    </tr>
  );
}

function TableHead({
  className,
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>): React.JSX.Element {
  return (
    <th className={cn("px-6 py-4 font-semibold tracking-wider", className)} {...props}>
      {children}
    </th>
  );
}

function TableCell({
  className,
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>): React.JSX.Element {
  return (
    <td className={cn("px-6 py-4 font-medium text-app-fg", className)} {...props}>
      {children}
    </td>
  );
}

function Table({ className, children, ...props }: TableProps): React.JSX.Element {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-app-border/40 bg-app-surface shadow-lg">
      <table className={cn("w-full text-left text-sm text-app-fg", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export default Table;
