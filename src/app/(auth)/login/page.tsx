"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { setCredentials } from "@/store/auth.store";
import AuthCard from "@/components/shared/auth-card";
import { apiTransformer } from "@/lib/api/api-transformer";
import LoginForm from "@/features/auth/components/login-form";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { type LoginFormData } from "@/features/auth/schemas/login.schema";
import { useLoginMutation } from "@/features/auth/services/auth-api.slice";

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [loginUser, { isLoading }] = useLoginMutation();

  React.useEffect((): void => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

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

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your AuraTours executive dashboard"
    >
      <LoginForm onSubmit={handleFormSubmit} isLoading={isLoading} />
    </AuthCard>
  );
}
