"use client";

import { z } from "zod";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useAppDispatch } from "@/redux/hooks";
import AuthCard from "@/components/auth/AuthCard";
import { setCredentials } from "@/redux/slices/authSlice";
import { useRegisterMutation } from "@/redux/services/authApiSlice";

import type { UserRole } from "@/types/auth";

const registerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CLIENT", "CONSULTANT", "ADMIN"]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CLIENT",
    },
  });

  const selectedRole = useWatch({ control, name: "role" });

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    try {
      const result = await registerUser(data).unwrap();
      dispatch(setCredentials(result));
      toast.success(`Account created successfully! Welcome, ${result.user.name}`);
      router.push("/");
    } catch (err: unknown) {
      const errorMsg = apiTransformer.transformError(
        err,
        "Registration failed. Email might already exist."
      );
      toast.error(errorMsg);
    }
  };

  return (
    <AuthCard
      title="Create Your Account"
      subtitle="Join AuraTours platform to curate and manage high-end travel packages."
    >
      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-4"
      >
        <div className="relative">
          <Input
            label="Full Name"
            type="text"
            placeholder="Alex Robinson"
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
            placeholder="alex.robinson@auratours.com"
            error={errors.email?.message}
            autoComplete="email"
            className="pl-10"
            {...register("email")}
          />
          <Mail className="w-4 h-4 text-app-muted absolute left-3.5 top-9.5 pointer-events-none" />
        </div>

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            error={errors.password?.message}
            autoComplete="new-password"
            className="pl-10 pr-10"
            {...register("password")}
          />
          <Lock className="w-4 h-4 text-app-muted absolute left-3.5 top-9.5 pointer-events-none" />
          <button
            type="button"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            className="absolute right-3.5 top-9.5 text-app-muted hover:text-app-fg transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Selector */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-semibold tracking-wider text-app-muted uppercase flex items-center justify-between">
            <span>Account Role</span>
            <span className="text-[10px] text-app-brand font-normal">
              {selectedRole === "ADMIN"
                ? "Full Access"
                : selectedRole === "CONSULTANT"
                  ? "Itinerary Manager"
                  : "Standard Access"}
            </span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["CLIENT", "CONSULTANT", "ADMIN"] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setValue("role", r, { shouldValidate: true });
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
      </form>

      {/* Login Redirect Link */}
      <div className="text-center text-xs text-app-muted pt-2 border-t border-app-border/40">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-app-brand font-bold hover:underline transition-all"
        >
          Sign In Here
        </Link>
      </div>
    </AuthCard>
  );
}
