"use client";

import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/auth.store";
import AuthCard from "@/components/shared/auth-card";
import { apiTransformer } from "@/lib/api/api-transformer";
import RegisterForm from "@/features/auth/components/register-form";
import { useRegisterMutation } from "@/features/auth/services/auth-api.slice";
import { type RegisterFormData } from "@/features/auth/schemas/register.schema";

export default function RegisterPage(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const handleFormSubmit = async (data: RegisterFormData): Promise<void> => {
    try {
      const response = await registerUser(data).unwrap();
      dispatch(setCredentials(response));
      toast.success(`Account created! Welcome, ${response.user.name}!`);
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error(apiTransformer.transformError(err, "Registration failed"));
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join AuraTours as a VIP Client, Consultant, or Admin"
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-app-brand hover:underline">
            Sign In
          </Link>
        </p>
      }
    >
      <RegisterForm onSubmit={handleFormSubmit} isLoading={isLoading} />
    </AuthCard>
  );
}
