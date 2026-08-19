"use client";

import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Mail, ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/button";
import Input, { PasswordInput } from "@/components/ui/input";

import { type LoginFormData, loginSchema } from "../schemas/login.schema";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
}

function FormAdditionalOptions(): React.JSX.Element {
  return (
    <div className="flex items-center justify-between text-xs my-1">
      <label className="flex items-center gap-2 text-app-muted hover:text-app-fg cursor-pointer select-none transition-colors">
        <input
          type="checkbox"
          defaultChecked
          className="rounded border-app-border bg-app-surface-variant text-app-brand focus:ring-app-brand/20 w-3.5 h-3.5 cursor-pointer accent-emerald-500"
        />
        <span>Remember me</span>
      </label>
      <Link
        href="#"
        onClick={(e): void => {
          e.preventDefault();
        }}
        className="text-app-brand hover:underline font-medium transition-colors"
      >
        Forgot password?
      </Link>
    </div>
  );
}

function LoginSubmitButton({ isLoading }: { isLoading: boolean }): React.JSX.Element {
  return (
    <Button
      type="submit"
      isLoading={isLoading}
      variant="primary"
      className="w-full py-3.5 mt-2 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-app-brand/25 transition-transform active:scale-[0.99]"
    >
      <span>{isLoading ? "Signing In..." : "Sign In to Dashboard"}</span>
      {!isLoading && <ArrowRight className="w-4 h-4 shrink-0" />}
    </Button>
  );
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
}): React.JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <form
      onSubmit={(e): void => {
        void handleSubmit(onSubmit)(e);
      }}
      className="flex flex-col gap-4"
    >
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        icon={Mail}
        error={errors.email?.message}
        autoComplete="email"
        {...register("email")}
      />

      <PasswordInput error={errors.password?.message} {...register("password")} />

      <FormAdditionalOptions />

      <LoginSubmitButton isLoading={isLoading} />
    </form>
  );
};

export default LoginForm;
