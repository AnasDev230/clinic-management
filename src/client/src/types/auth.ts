export type { ApiResponse } from "./common";

export interface AuthUser {
  userId: string;
  email: string;
  fullName?: string | null;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginResponse extends TokenResponse {
  userId: string;
  email: string;
  fullName?: string | null;
  roles: string[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
