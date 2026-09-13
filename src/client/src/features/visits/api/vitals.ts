import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types/common";
import type { CreateVitalsRequest, VitalsDetail } from "@/types/visit";

export async function fetchVitals(
  visitId: string,
): Promise<VitalsDetail | null> {
  const response = await apiClient.get<ApiResponse<VitalsDetail | null>>(
    `/visits/${visitId}/vitals`,
  );
  return response.data.data;
}

export async function saveVitals(
  visitId: string,
  data: CreateVitalsRequest,
): Promise<VitalsDetail> {
  const response = await apiClient.put<ApiResponse<VitalsDetail>>(
    `/visits/${visitId}/vitals`,
    data,
  );
  return response.data.data;
}
