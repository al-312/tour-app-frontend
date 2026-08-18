"use client";

import { z } from "zod";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, type UseFormRegister } from "react-hook-form";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

import { apiTransformer } from "@/utils";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import AuthCard from "@/components/auth/AuthCard";
import { setCredentials } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLoginMutation } from "@/redux/services/authApiSlice";

import {
  DemoAccountsSelector,
  type DemoAccount,
} from "./components/DemoAccountsSelector";

const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function RememberMeRow(): React.JSX.Element {
  return (
    <div className="flex items-center justify-between text-xs text-app-muted pt-1">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          defaultChecked
          className="rounded border-app-border bg-app-surface-variant text-app-brand focus:ring-app-brand"
        />
        <span>Remember me</span>
      </label>
      <Link
        href="#"
        onClick={(e): void => {
          e.preventDefault();
          toast.info("Password reset link sent to registered email upon request.");
        }}
        className="text-app-brand hover:underline font-semibold"
      >
        Forgot Password?
      </Link>
    </div>
  );
}

function LoginPasswordInput({
  register,
  errorMsg,
}: {
  register: UseFormRegister<LoginFormData>;
  errorMsg?: string | undefined;
}): React.JSX.Element {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        error={errorMsg}
        autoComplete="current-password"
        className="pl-10 pr-10"
        {...register("password")}
      />
      <Lock className="w-4 h-4 text-app-muted absolute left-3.5 top-9.5 pointer-events-none" />
      <button
        type="button"
        onClick={(): void => {
          setShowPassword(!showPassword);
        }}
        className="absolute right-3.5 top-9.5 text-app-muted hover:text-app-fg transition-colors"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

function LoginSubmitButton({ isLoading }: { isLoading: boolean }): React.JSX.Element {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      variant="primary"
      className="w-full py-3.5 mt-2 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-app-brand/20"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <span>Sign In to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </Button>
  );
}

function LoginFormFields({
  onSubmit,
  isLoading,
  onFillDemo,
}: {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  onFillDemo: (
    acc: DemoAccount,
    setVal: (field: "email" | "password", val: string) => void
  ) => void;
}): React.JSX.Element {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <>
      <form
        onSubmit={(e): void => {
          void handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-4"
      >
        <div className="relative">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            error={errors.email?.message}
            autoComplete="email"
            className="pl-10"
            {...register("email")}
          />
          <Mail className="w-4 h-4 text-app-muted absolute left-3.5 top-9.5 pointer-events-none" />
        </div>

        <LoginPasswordInput register={register} errorMsg={errors.password?.message} />
        <RememberMeRow />
        <LoginSubmitButton isLoading={isLoading} />
      </form>

      <DemoAccountsSelector
        onSelect={(acc): void => {
          onFillDemo(acc, (field, val) => {
            setValue(field, val, { shouldValidate: true });
          });
        }}
      />
    </>
  );
}

function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  const redirectTarget = searchParams.get("redirect") ?? "/dashboard";

  React.useEffect((): void => {
    if (isAuthenticated) {
      toast.info("You are already signed in. Redirecting to dashboard...");
      router.replace(redirectTarget);
    }
  }, [isAuthenticated, router, redirectTarget]);

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      toast.success(`Welcome back, ${result.user.name}!`);
      router.push(redirectTarget);
    } catch (err: unknown) {
      const errorMsg = apiTransformer.transformError(
        err,
        "Authentication failed. Please check credentials."
      );
      toast.error(errorMsg);
    }
  };

  const handleFillDemo = (
    account: DemoAccount,
    setVal: (field: "email" | "password", val: string) => void
  ): void => {
    setVal("email", account.email);
    setVal("password", "Password123!");
    toast.info(`Filled credentials for ${account.name} (${account.role})`);
  };

  return (
    <AuthCard
      title="Sign In to AuraTours"
      subtitle="Access your tour packages, bookings, and luxury itinerary management."
    >
      <LoginFormFields
        onSubmit={onSubmit}
        isLoading={isLoading}
        onFillDemo={handleFillDemo}
      />

      <div className="text-center text-xs text-app-muted pt-2 border-t border-app-border/40">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-app-brand font-bold hover:underline transition-all"
        >
          Create an Account
        </Link>
      </div>
    </AuthCard>
  );
}

export default function LoginPage(): React.JSX.Element {
  return (
    <div className="flex-1 flex items-center justify-center w-full my-auto">
      <React.Suspense
        fallback={
          <div className="flex flex-col items-center gap-2 p-8 animate-pulse text-app-muted">
            <div className="w-8 h-8 rounded-full border-2 border-app-brand border-t-transparent animate-spin" />
            <span className="text-xs font-medium">Loading login portal...</span>
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>
    </div>
  );
}
