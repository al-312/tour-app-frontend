"use client";

import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/auth.store";
import AuthCard from "@/components/shared/auth-card";
import { apiTransformer } from "@/lib/api/api-transformer";
import LoginForm from "@/features/auth/components/login-form";
import { type LoginFormData } from "@/features/auth/schemas/login.schema";
import { useLoginMutation } from "@/features/auth/services/auth-api.slice";
import { type DemoAccount } from "@/features/auth/components/demo-accounts-selector";

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginUser, { isLoading }] = useLoginMutation();

  const handleFormSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      const response = await loginUser(data).unwrap();
      dispatch(setCredentials(response));
      toast.success(`Welcome back, ${response.user.name}!`);
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error(apiTransformer.transformError(err, "Invalid credentials"));
    }
  };

  const handleFillDemo = (
    acc: DemoAccount,
    setValue: (field: "email" | "password", val: string) => void
  ): void => {
    setValue("email", acc.email);
    setValue("password", "password123");
    toast.info(`Filled ${acc.label} credentials`);
  };

  return (
    <AuthCard
      title="Sign In"
      subtitle="Access your AuraTours executive dashboard"
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-app-brand hover:underline">
            Create Account
          </Link>
        </p>
      }
    >
      <LoginForm
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        onFillDemo={handleFillDemo}
      />
    </AuthCard>
  );
}
