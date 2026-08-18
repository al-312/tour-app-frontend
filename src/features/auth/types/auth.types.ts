export type UserRole = "ADMIN" | "CONSULTANT" | "CLIENT";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role?: UserRole | undefined;
}
