"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, ShieldCheck, KeyRound, Shield } from "lucide-react";

import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { updateCurrentUser } from "@/store/auth.store";
import { apiTransformer } from "@/lib/api/api-transformer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useUpdateUserMutation } from "@/features/users/services/users-api.slice";
import {
  updateUserSchema,
  type UpdateUserFormData,
} from "@/features/users/schemas/user.schema";

import type { UpdateUserRequest } from "@/features/users/types/user.types";

function ProfileHeader({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: string;
}): React.JSX.Element {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const roleVariant =
    role === "ADMIN" ? "rose" : role === "CONSULTANT" ? "amber" : "emerald";

  return (
    <Card className="p-5 sm:p-6 xl:p-8 bg-linear-to-br from-app-surface via-app-surface to-app-surface-variant/40 relative overflow-hidden border-app-border/60">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 z-10 relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-tr from-app-brand via-brand-500 to-emerald-400 flex items-center justify-center text-white text-xl sm:text-2xl font-extrabold shadow-xl shadow-app-brand/25 shrink-0">
          {initials}
        </div>

        <div className="flex flex-col text-center sm:text-left gap-1.5 grow min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Heading level={1} size="xl" className="truncate">
              {name}
            </Heading>
            <Badge variant={roleVariant} className="w-fit mx-auto sm:mx-0 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              {role} Account
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-app-muted font-medium truncate">
            {email}
          </p>
        </div>
      </div>
    </Card>
  );
}

function PersonalInfoForm(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const onSubmit = async (data: UpdateUserFormData): Promise<void> => {
    if (!user) return;
    try {
      const payload: UpdateUserRequest = {};
      if (data.name) payload.name = data.name;
      if (data.email) payload.email = data.email;

      const updated = await updateUser({ id: user.id, data: payload }).unwrap();
      dispatch(updateCurrentUser(updated));
      toast.success("Profile information updated successfully!");
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to update profile"));
    }
  };

  return (
    <Card className="p-5 sm:p-6 xl:p-7 flex flex-col justify-between gap-6 h-full">
      <div className="flex flex-col gap-6">
        <div>
          <Heading level={3} size="md" className="flex items-center gap-2">
            <User className="w-4 h-4 text-app-brand shrink-0" />
            <span>Personal Details</span>
          </Heading>
          <p className="text-xs text-app-muted mt-1">
            Update your public profile name and primary email address.
          </p>
        </div>

        <form
          id="personal-info-form"
          onSubmit={(e): void => {
            void handleSubmit(onSubmit)(e);
          }}
          className="flex flex-col gap-4"
        >
          <Input
            label="Full Name"
            icon={User}
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            error={errors.email?.message}
            {...register("email")}
          />
        </form>
      </div>

      <div className="flex items-center justify-end pt-2 border-t border-app-border/30">
        <Button
          type="submit"
          form="personal-info-form"
          isLoading={isLoading}
          disabled={!isDirty}
          className="w-full sm:w-auto"
        >
          Save Details
        </Button>
      </div>
    </Card>
  );
}

function SecurityPasswordForm(): React.JSX.Element {
  const { user } = useAppSelector((state) => state.auth);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setPasswordError(null);

    if (!user) return;
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      await updateUser({
        id: user.id,
        data: { password },
      }).unwrap();
      toast.success("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(apiTransformer.transformError(err, "Failed to update password"));
    }
  };

  return (
    <Card className="p-5 sm:p-6 xl:p-7 flex flex-col justify-between gap-6 h-full">
      <div className="flex flex-col gap-6">
        <div>
          <Heading level={3} size="md" className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-app-brand shrink-0" />
            <span>Security Credentials</span>
          </Heading>
          <p className="text-xs text-app-muted mt-1">
            Change your account password to maintain security.
          </p>
        </div>

        <form
          id="security-password-form"
          onSubmit={(e): void => {
            void handlePasswordSubmit(e);
          }}
          className="flex flex-col gap-4"
        >
          <Input
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            icon={Lock}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            error={passwordError ?? undefined}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </form>
      </div>

      <div className="flex items-center justify-end pt-2 border-t border-app-border/30">
        <Button
          type="submit"
          form="security-password-form"
          isLoading={isLoading}
          disabled={!password || !confirmPassword}
          className="w-full sm:w-auto"
        >
          Update Password
        </Button>
      </div>
    </Card>
  );
}

function AccountOverviewCard(): React.JSX.Element {
  const { user } = useAppSelector((state) => state.auth);

  const getRoleDescription = (role?: string): string => {
    switch (role) {
      case "ADMIN":
        return "Full administrative access to all system accounts, itineraries, roles, and global configurations.";
      case "CONSULTANT":
        return "Access to create, draft, manage, and assign custom client itineraries and booking clearances.";
      case "CLIENT":
        return "Access to view booked itineraries, submit curation requests, and view personal bookings.";
      default:
        return "Standard system access.";
    }
  };

  return (
    <Card className="p-5 sm:p-6 xl:p-7 flex flex-col justify-between gap-6 h-full">
      <div className="flex flex-col gap-5">
        <div>
          <Heading level={3} size="md" className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-app-brand shrink-0" />
            <span>Account Privileges</span>
          </Heading>
          <p className="text-xs text-app-muted mt-1">
            System role assignment and permission capabilities.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-app-muted uppercase font-label-caps">
            Assigned Role Capabilities
          </span>
          <p className="text-xs text-app-fg leading-relaxed bg-app-surface-variant/60 p-3.5 rounded-xl border border-app-border/40 font-medium">
            {getRoleDescription(user?.role)}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function ProfilePage(): React.JSX.Element {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="p-8 text-center text-app-muted text-sm font-medium">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full mx-auto">
      <ProfileHeader name={user.name} email={user.email} role={user.role} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 xl:gap-8">
        <PersonalInfoForm />
        <SecurityPasswordForm />
        <div className="md:col-span-2 lg:col-span-1">
          <AccountOverviewCard />
        </div>
      </div>
    </div>
  );
}
