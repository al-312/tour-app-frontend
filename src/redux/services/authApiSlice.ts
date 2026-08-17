import { apiTransformer } from "@/utils/apiTransformer";

import { apiSlice } from "./apiSlice";

import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types/auth";

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
    getMe: builder.query<User, undefined>({
      query: () => "/auth/me",
      transformResponse: apiTransformer.unwrapData<User>,
      providesTags: ["User"],
    }),
    refreshToken: builder.mutation<
      { accessToken: string; refreshToken: string },
      { refreshToken: string }
    >({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
      transformResponse: apiTransformer.unwrapData<{
        accessToken: string;
        refreshToken: string;
      }>,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useRefreshTokenMutation,
} = authApiSlice;
