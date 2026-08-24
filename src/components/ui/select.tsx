import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string | undefined;
  error?: string | undefined;
  icon?: React.ComponentType<{ className?: string }> | undefined;
  options?: SelectOption[] | undefined;
}

function SelectLabel({
  label,
}: {
  label?: string | undefined;
}): React.JSX.Element | null {
  if (!label) return null;
  return (
    <label className="text-xs font-semibold tracking-wider text-app-muted uppercase font-label-caps">
      {label}
    </label>
  );
}

function SelectErrorMessage({
  error,
}: {
  error?: string | undefined;
}): React.JSX.Element | null {
  if (!error) return null;
  return <span className="text-xs font-medium text-app-error">{error}</span>;
}

function SelectStartIcon({
  icon: Icon,
}: {
  icon?: React.ComponentType<{ className?: string }> | undefined;
}): React.JSX.Element | null {
  if (!Icon) return null;
  return (
    <Icon className="w-4 h-4 text-app-muted absolute left-3.5 top-3.5 pointer-events-none z-10" />
  );
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, icon: Icon, options, children, ...props }, ref) => {
    const selectClass = cn(
      "w-full px-4 py-3 pr-10 bg-app-surface-variant border border-app-border/80 rounded-xl text-app-fg text-sm transition-all duration-200 outline-none appearance-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20 cursor-pointer",
      Boolean(Icon) && "pl-10",
      Boolean(error) && "border-app-error focus:border-app-error focus:ring-app-error/20",
      className
    );

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <SelectLabel label={label} />
        <div className="relative w-full">
          <SelectStartIcon icon={Icon} />
          <select ref={ref} className={selectClass} {...props}>
            {options?.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-app-surface text-app-fg"
              >
                {opt.label}
              </option>
            ))}
            {children}
          </select>
          <ChevronDown className="w-4 h-4 text-app-muted absolute right-3.5 top-3.5 pointer-events-none z-10" />
        </div>
        <SelectErrorMessage error={error} />
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
