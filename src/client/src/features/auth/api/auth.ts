import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types/auth";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
} from "@/types/auth";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    data,
  );
  return response.data.data;
}

export async function logout(data: RefreshTokenRequest): Promise<void> {
  await apiClient.post("/auth/logout", data);
}
