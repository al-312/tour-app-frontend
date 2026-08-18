import { apiSlice } from "@/lib/api/client";
import { apiTransformer } from "@/lib/api/api-transformer";

import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth.types";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: apiTransformer.unwrapData<AuthResponse>,
      invalidatesTags: ["Auth", "User"],
    }),
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      transformResponse: apiTransformer.unwrapData<AuthResponse>,
      invalidatesTags: ["Auth", "User"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApiSlice;
