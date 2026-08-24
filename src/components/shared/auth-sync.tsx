"use client";

import * as React from "react";

import { storage } from "@/lib/utils/storage";
import { useAppDispatch } from "@/store/hooks";
import { STORAGE_KEYS } from "@/lib/constants/app.constants";
import { setCredentials, setHydrated } from "@/store/auth.store";

import type { User } from "@/features/auth/types/auth.types";

function getValidStoredAuth(): {
  user: User;
  accessToken: string;
  refreshToken: string;
} | null {
  const token = storage.getItemDecoded(STORAGE_KEYS.AUTH_TOKEN) as string | null;
  const user = storage.getItemDecoded(STORAGE_KEYS.USER) as User | null;

  if (!token || !user) {
    return null;
  }

  const refreshToken =
    (storage.getItemDecoded(STORAGE_KEYS.REFRESH_TOKEN) as string | null) ?? "";
  return { accessToken: token, refreshToken, user };
}

export default function AuthSync(): null {
  const dispatch = useAppDispatch();

  React.useEffect((): void => {
    const validStored = getValidStoredAuth();
    if (validStored) {
      dispatch(setCredentials(validStored));
    } else {
      dispatch(setHydrated());
    }
  }, [dispatch]);

  return null;
}
