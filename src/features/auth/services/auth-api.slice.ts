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
    getMe: builder.query<AuthResponse["user"], undefined>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      transformResponse: apiTransformer.unwrapData<AuthResponse["user"]>,
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApiSlice;
