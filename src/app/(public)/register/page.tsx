"use client";

import { z } from "zod";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type UseFormRegister } from "react-hook-form";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";

import { apiTransformer } from "@/utils";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import AuthCard from "@/components/auth/AuthCard";
import { setCredentials } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRegisterMutation } from "@/redux/services/authApiSlice";

import type { UserRole } from "@/types/auth";

const registerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CLIENT", "CONSULTANT", "ADMIN"]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

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
      <label className="text-xs font-semibold tracking-wider text-app-muted uppercase flex items-center justify-between">
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
                : "bg-app-surface-variant text-app-fg border-app-border hover:bg-app-border/40"
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

function RegisterPasswordInput({
  register,
  errorMsg,
}: {
  register: UseFormRegister<RegisterFormData>;
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
        autoComplete="new-password"
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

function RegisterSubmitButton({ isLoading }: { isLoading: boolean }): React.JSX.Element {
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
          <span>Complete Registration</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </Button>
  );
}

function RegisterFormFields({
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

      <RegisterPasswordInput register={register} errorMsg={errors.password?.message} />

      <RoleSelector
        selectedRole={selectedRole}
        onSelect={(role): void => {
          setValue("role", role, { shouldValidate: true });
        }}
      />

      <RegisterSubmitButton isLoading={isLoading} />
    </form>
  );
}

export default function RegisterPage(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [registerUser, { isLoading }] = useRegisterMutation();

  React.useEffect((): void => {
    if (isAuthenticated) {
      toast.info("You are already signed in. Redirecting to dashboard...");
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleRegistration = async (data: RegisterFormData): Promise<void> => {
    try {
      const result = await registerUser(data).unwrap();
      dispatch(setCredentials(result));
      toast.success(`Account created successfully! Welcome, ${result.user.name}`);
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMsg = apiTransformer.transformError(
        err,
        "Registration failed. Email might already exist."
      );
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center w-full my-auto">
      <AuthCard
        title="Create Your Account"
        subtitle="Join AuraTours platform to curate and manage high-end travel packages."
      >
        <RegisterFormFields onSubmit={handleRegistration} isLoading={isLoading} />

        <div className="text-center text-xs text-app-muted pt-2 border-t border-app-border/40">
          Already have an account?{" "}
          <Link
            href="/register"
            className="text-app-brand font-bold hover:underline transition-all"
          >
            Sign In Here
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
