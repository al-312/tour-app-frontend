import * as React from "react";

import { cn } from "@/lib/utils/cn";

interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  className?: string | undefined;
  emptyMessage?: string | undefined;
}

function List<T>({
  items,
  renderItem,
  keyExtractor,
  className,
  emptyMessage = "No items available.",
}: ListProps<T>): React.JSX.Element {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-app-muted font-medium">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {items.map((item, index) => (
        <React.Fragment key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
}

export default List;
