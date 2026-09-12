import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types/auth";
import type {
  ClinicProfile,
  ClinicSettings,
  UpdateClinicProfileRequest,
  UpdateClinicSettingsRequest,
} from "@/types/clinic";

export async function fetchClinicProfile(): Promise<ClinicProfile> {
  const response =
    await apiClient.get<ApiResponse<ClinicProfile>>("/clinic/profile");
  return response.data.data;
}

export async function updateClinicProfile(
  data: UpdateClinicProfileRequest,
): Promise<ClinicProfile> {
  const response = await apiClient.put<ApiResponse<ClinicProfile>>(
    "/clinic/profile",
    data,
  );
  return response.data.data;
}

export async function fetchClinicSettings(): Promise<ClinicSettings> {
  const response =
    await apiClient.get<ApiResponse<ClinicSettings>>("/clinic/settings");
  return response.data.data;
}

export async function updateClinicSettings(
  data: UpdateClinicSettingsRequest,
): Promise<ClinicSettings> {
  const response = await apiClient.put<ApiResponse<ClinicSettings>>(
    "/clinic/settings",
    data,
  );
  return response.data.data;
}
