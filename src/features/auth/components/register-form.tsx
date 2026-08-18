"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import { useForm, type UseFormRegister, type FieldErrors } from "react-hook-form";

import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import Input, { PasswordInput } from "@/components/ui/input";

import { type RegisterFormData, registerSchema } from "../schemas/register.schema";

const ROLE_OPTIONS = [
  { value: "CLIENT", label: "Client — Standard Access" },
  { value: "CONSULTANT", label: "Consultant — Itinerary Manager" },
  { value: "ADMIN", label: "Admin — Full Access" },
];

function RegisterSubmitButton({ isLoading }: { isLoading: boolean }): React.JSX.Element {
  return (
    <Button
      type="submit"
      isLoading={isLoading}
      variant="primary"
      className="w-full py-3.5 mt-2 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-app-brand/20"
    >
      <span>Complete Registration</span>
      <ArrowRight className="w-4 h-4" />
    </Button>
  );
}

function NameEmailFields({
  register,
  errors,
}: {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
}): React.JSX.Element {
  return (
    <>
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        icon={UserIcon}
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        icon={Mail}
        error={errors.email?.message}
        autoComplete="email"
        {...register("email")}
      />
    </>
  );
}

function SecurityRoleFields({
  register,
  errors,
}: {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
}): React.JSX.Element {
  return (
    <>
      <PasswordInput
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Select
        label="Account Role"
        icon={ShieldCheck}
        options={ROLE_OPTIONS}
        error={errors.role?.message}
        {...register("role")}
      />
    </>
  );
}

function RegisterForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", role: "CLIENT" },
  });

  return (
    <form
      onSubmit={(e): void => {
        void handleSubmit(onSubmit)(e);
      }}
      className="flex flex-col gap-4"
    >
      <NameEmailFields register={register} errors={errors} />
      <SecurityRoleFields register={register} errors={errors} />
      <RegisterSubmitButton isLoading={isLoading} />
    </form>
  );
}

export default RegisterForm;
