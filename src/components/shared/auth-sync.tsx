"use client";

import * as React from "react";

import { storage } from "@/lib/utils/storage";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, logout } from "@/store/auth.store";

import type { User } from "@/features/auth/types/auth.types";

export default function AuthSync(): null {
  const dispatch = useAppDispatch();

  React.useEffect((): void => {
    const rawToken = storage.getItemDecoded("auth_token");
    const rawUser = storage.getItemDecoded("auth_user");

    if (typeof rawToken === "string" && rawUser && typeof rawUser === "object") {
      dispatch(
        setCredentials({
          accessToken: rawToken,
          refreshToken: "",
          user: rawUser as User,
        })
      );
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  return null;
}
