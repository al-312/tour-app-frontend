export type UserRole = "SUPER_ADMIN" | "ADMIN" | "CONSULTANT" | "CLIENT";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status?: string;
  mustChangePassword?: boolean;
  passwordChangedAt?: string | null;
  phone?: string | null;
  companyName?: string | null;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
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
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}
