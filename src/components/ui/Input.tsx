import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | undefined;
  error?: string | undefined;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold tracking-wider text-app-muted uppercase font-label-caps">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full px-4 py-3 bg-app-surface-variant border border-app-border/80 rounded-xl text-app-fg text-sm placeholder:text-app-muted/60 transition-all duration-200 outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20",
            error && "border-app-error focus:border-app-error focus:ring-app-error/20",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs font-medium text-app-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

function PasswordToggleButton({
  showPassword,
  onToggle,
}: {
  showPassword: boolean;
  onToggle: () => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={showPassword ? "Hide password" : "Show password"}
      className="absolute right-3.5 top-3.5 text-app-muted hover:text-app-fg transition-colors cursor-pointer"
    >
      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label = "Password", error, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = React.useCallback((): void => {
      setShowPassword((prev) => !prev);
    }, []);

    return (
      <div className="flex flex-col gap-1.5 w-full relative">
        <label className="text-xs font-semibold tracking-wider text-app-muted uppercase font-label-caps">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={cn(
              "w-full pl-10 pr-10 py-3 bg-app-surface-variant border border-app-border/80 rounded-xl text-app-fg text-sm placeholder:text-app-muted/60 transition-all duration-200 outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20",
              error && "border-app-error focus:border-app-error focus:ring-app-error/20",
              className
            )}
            {...props}
          />
          <Lock className="w-4 h-4 text-app-muted absolute left-3.5 top-3.5 pointer-events-none" />
          <PasswordToggleButton
            showPassword={showPassword}
            onToggle={togglePasswordVisibility}
          />
        </div>
        {error && <span className="text-xs font-medium text-app-error">{error}</span>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default Input;
