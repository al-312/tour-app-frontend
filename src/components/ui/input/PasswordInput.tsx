"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import Input from "./Input";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | undefined;
  error?: string | undefined;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label = "Password",
      error,
      className = "",
      autoComplete = "current-password",
      placeholder = "Enter your password",
      ...props
    },
    ref
  ): React.JSX.Element => {
    const [showPassword, setShowPassword] = React.useState(false);

    const toggleVisibility = (): void => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          label={label}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          error={error}
          autoComplete={autoComplete}
          className={`pl-10 pr-10 ${className}`}
          {...props}
        />
        <Lock className="w-4 h-4 text-app-muted absolute left-3.5 top-[38px] pointer-events-none" />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3.5 top-[38px] text-app-muted hover:text-app-fg transition-colors cursor-pointer"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
