import * as React from "react";

import { cn } from "@/lib/utils/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string | undefined;
  error?: string | undefined;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, rows = 3, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold tracking-wider text-app-muted uppercase font-label-caps">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            "w-full px-4 py-3 bg-app-surface-variant border border-app-border/80 rounded-xl text-app-fg text-sm placeholder:text-app-muted/60 transition-all duration-200 outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20 resize-y",
            Boolean(error) &&
              "border-app-error focus:border-app-error focus:ring-app-error/20",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs font-medium text-app-error">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
