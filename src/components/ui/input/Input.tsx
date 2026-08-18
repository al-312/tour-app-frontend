import * as React from "react";

import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", type = "text", ...props }, ref): React.JSX.Element => {
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold tracking-wider text-app-muted uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full bg-app-surface-variant text-app-fg border border-app-border focus:border-app-brand focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-colors duration-300 placeholder-app-muted",
            hasError && "border-app-error",
            className
          )}
          {...props}
        />
        {hasError && (
          <span className="text-xs font-semibold text-app-error">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
