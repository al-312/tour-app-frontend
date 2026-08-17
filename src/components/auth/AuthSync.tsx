"use client";

import * as React from "react";

import { setUser } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetMeQuery, useRefreshTokenMutation } from "@/redux/services/authApiSlice";

export default function AuthSync(): null {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [refreshTokenMutation] = useRefreshTokenMutation();

  const { data: meData } = useGetMeQuery(undefined, {
    skip: !token,
  });

  React.useEffect(() => {
    if (meData) {
      dispatch(setUser(meData));
    }
  }, [meData, dispatch]);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      void refreshTokenMutation;
    }
  }, [refreshTokenMutation]);

  return null;
}
