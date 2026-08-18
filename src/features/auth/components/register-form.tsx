"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import {
  useForm,
  useWatch,
  type UseFormRegister,
  type FieldErrors,
} from "react-hook-form";

import Button from "@/components/ui/button";
import Input, { PasswordInput } from "@/components/ui/input";

import { type RegisterFormData, registerSchema } from "../schemas/register.schema";

import type { UserRole } from "../types/auth.types";

function RoleSelector({
  selectedRole,
  onSelect,
}: {
  selectedRole: UserRole;
  onSelect: (role: UserRole) => void;
}): React.JSX.Element {
  const roles: UserRole[] = ["CLIENT", "CONSULTANT", "ADMIN"];
  const roleLabels: Record<UserRole, string> = {
    ADMIN: "Full Access",
    CONSULTANT: "Itinerary Manager",
    CLIENT: "Standard Access",
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold tracking-wider text-app-muted uppercase flex items-center justify-between font-label-caps">
        <span>Account Role</span>
        <span className="text-[10px] text-app-brand font-normal">
          {roleLabels[selectedRole]}
        </span>
      </label>
      <div className="grid grid-cols-3 gap-2">
        {roles.map((r) => (
          <button
            key={r}
            type="button"
            onClick={(): void => {
              onSelect(r);
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 capitalize flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === r
                ? "bg-app-brand text-white border-app-brand shadow-sm"
                : "bg-app-surface-variant text-app-fg border-app-border/80 hover:bg-app-border/40"
            }`}
          >
            {r === "ADMIN" && <ShieldCheck className="w-3.5 h-3.5" />}
            <span>{r.toLowerCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RegisterInputFields({
  register,
  errors,
}: {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
}): React.JSX.Element {
  return (
    <>
      <div className="relative">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          error={errors.name?.message}
          className="pl-10"
          {...register("name")}
        />
        <UserIcon className="w-4 h-4 text-app-muted absolute left-3.5 top-9.5 pointer-events-none" />
      </div>

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

      <PasswordInput
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
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
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", role: "CLIENT" },
  });

  const selectedRole = useWatch({ control, name: "role" });

  return (
    <form
      onSubmit={(e): void => {
        void handleSubmit(onSubmit)(e);
      }}
      className="flex flex-col gap-4"
    >
      <RegisterInputFields register={register} errors={errors} />

      <RoleSelector
        selectedRole={selectedRole}
        onSelect={(role): void => {
          setValue("role", role, { shouldValidate: true });
        }}
      />

      <Button
        type="submit"
        isLoading={isLoading}
        variant="primary"
        className="w-full py-3.5 mt-2 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-app-brand/20"
      >
        <span>Complete Registration</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </form>
  );
}

export default RegisterForm;
