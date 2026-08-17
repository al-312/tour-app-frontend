"use client";

import { z } from "zod";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { apiTransformer } from "@/utils";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import AuthCard from "@/components/auth/AuthCard";
import { setCredentials } from "@/redux/slices/authSlice";
import { useLoginMutation } from "@/redux/services/authApiSlice";

const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      toast.success(`Welcome back, ${result.user.name}!`);
      router.push("/");
    } catch (err: unknown) {
      const errorMsg = apiTransformer.transformError(
        err,
        "Authentication failed. Please check credentials."
      );
      toast.error(errorMsg);
    }
  };

  const fillDemoUser = (demoEmail: string, roleName: string): void => {
    setValue("email", demoEmail, { shouldValidate: true });
    setValue("password", "Password123!", { shouldValidate: true });
    toast.info(`Filled credentials for ${roleName} demo`);
  };

  return (
    <AuthCard
      title="Sign In to AuraTours"
      subtitle="Access your tour packages, bookings, and luxury itinerary management."
    >
      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-4"
      >
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
          <Mail className="w-4 h-4 text-app-muted absolute left-3.5 top-[38px] pointer-events-none" />
        </div>

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.password?.message}
            autoComplete="current-password"
            className="pl-10 pr-10"
            {...register("password")}
          />
          <Lock className="w-4 h-4 text-app-muted absolute left-3.5 top-[38px] pointer-events-none" />
          <button
            type="button"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            className="absolute right-3.5 top-[38px] text-app-muted hover:text-app-fg transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-app-muted pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-app-border bg-app-surface-variant text-app-brand focus:ring-app-brand"
            />
            <span>Remember me</span>
          </label>
          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              toast.info("Password reset link sent to registered email upon request.");
            }}
            className="text-app-brand hover:underline font-semibold"
          >
            Forgot Password?
          </a>
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
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Demo Quick Selector */}
      <div className="border-t border-app-border/60 pt-4 flex flex-col gap-2">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-app-muted text-center">
          Quick Fill Demo Accounts
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              fillDemoUser("admin@auratours.com", "Admin");
            }}
            className="px-2 py-1.5 rounded-lg border border-app-border/60 bg-app-surface-variant hover:bg-app-brand-bg transition-colors text-[11px] font-medium text-app-fg flex items-center justify-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            onClick={() => {
              fillDemoUser("consultant@auratours.com", "Consultant");
            }}
            className="px-2 py-1.5 rounded-lg border border-app-border/60 bg-app-surface-variant hover:bg-app-brand-bg transition-colors text-[11px] font-medium text-app-fg flex items-center justify-center gap-1 cursor-pointer"
          >
            <UserCheck className="w-3 h-3 text-sky-500" />
            <span>Consultant</span>
          </button>
          <button
            type="button"
            onClick={() => {
              fillDemoUser("client@auratours.com", "Client");
            }}
            className="px-2 py-1.5 rounded-lg border border-app-border/60 bg-app-surface-variant hover:bg-app-brand-bg transition-colors text-[11px] font-medium text-app-fg flex items-center justify-center gap-1 cursor-pointer"
          >
            <UserCheck className="w-3 h-3 text-amber-500" />
            <span>Client</span>
          </button>
        </div>
      </div>

      {/* Register Redirect Link */}
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
