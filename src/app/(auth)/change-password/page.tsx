"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, Shield } from "lucide-react";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { setCredentials } from "@/store/auth.store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useChangePasswordMutation } from "@/features/auth/services/auth-api.slice";

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

export default function ChangePasswordPage(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token, refreshToken } = useAppSelector((state) => state.auth);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation password do not match.");
      return;
    }

    try {
      const result = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      if (token && refreshToken) {
        dispatch(
          setCredentials({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          })
        );
      }

      setSuccessMessage("Password changed successfully! Redirecting...");
      setTimeout(() => {
        if (user?.role === "CONSULTANT") {
          router.replace("/packages/search");
        } else {
          router.replace("/consultants");
        }
      }, 1500);
    } catch (err: unknown) {
      const apiError = err as ApiError | undefined;
      setErrorMessage(
        apiError?.data?.message ??
          apiError?.message ??
          "Failed to change password. Please check your credentials."
      );
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-app-surface border border-app-border/80 rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-app-brand/10 border border-app-brand/20 flex items-center justify-center text-app-brand mb-3">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-app-fg font-display-lg">
            {user?.mustChangePassword ? "Set Up New Password" : "Change Password"}
          </h1>
          <p className="text-xs text-app-muted mt-1">
            {user?.mustChangePassword
              ? "You are logged in with a temporary password. Please set a new password to activate your account."
              : "Update your account password below."}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1.5">
              Current / Temporary Password
            </label>
            <Input
              type="password"
              placeholder="Enter current or temporary password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
              }}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1.5">
              New Password
            </label>
            <Input
              type="password"
              placeholder="Enter new password (min. 6 chars)"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1.5">
              Confirm New Password
            </label>
            <Input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Saving New Password..." : "Update Password & Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
