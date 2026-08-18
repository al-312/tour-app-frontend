export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const STORAGE_SECRET: string =
  process.env.NEXT_PUBLIC_STORAGE_SECRET ?? "auratours_secure_storage_key_2026";

export const STORAGE_KEYS = {
  AUTH_TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
} as const;
