"use client";

import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import { apiTransformer } from "@/utils";
import AuthCard from "@/components/auth/AuthCard";
import { setCredentials } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLoginMutation } from "@/redux/services/authApiSlice";

import LoginForm from "./components/LoginForm";
import { type LoginFormData } from "./schema/loginSchema";
import { type DemoAccount } from "./components/DemoAccountsSelector";

function LoginCardContainer(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [login, { isLoading, isSuccess: isLoginSuccess }] = useLoginMutation();

  const redirectTarget = searchParams.get("redirect") ?? "/dashboard";

  React.useEffect((): void => {
    if (isAuthenticated && !isLoginSuccess) {
      toast.info("You are already signed in. Redirecting to dashboard...");
      router.replace(redirectTarget);
    }
  }, [isAuthenticated, isLoginSuccess, router, redirectTarget]);

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
      <LoginForm onSubmit={onSubmit} isLoading={isLoading} onFillDemo={handleFillDemo} />

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
        <LoginCardContainer />
      </React.Suspense>
    </div>
  );
}
