import apiClient from "@/lib/api-client";
import type { ApiResponse, PagedResult } from "@/types/common";
import type {
  CreateMedicalServiceRequest,
  MedicalServiceDetail,
  MedicalServiceDropdown,
  MedicalServiceListItem,
  UpdateMedicalServiceRequest,
} from "@/types/medical-service";

export interface FetchMedicalServicesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
}

export async function fetchMedicalServicesList(
  params: FetchMedicalServicesParams = {},
): Promise<PagedResult<MedicalServiceListItem>> {
  const response = await apiClient.get<ApiResponse<PagedResult<MedicalServiceListItem>>>(
    "/medical-services",
    { params },
  );
  return response.data.data;
}

export async function fetchMedicalServicesDropdown(): Promise<MedicalServiceDropdown[]> {
  const response = await apiClient.get<ApiResponse<MedicalServiceDropdown[]>>(
    "/medical-services/dropdown",
  );
  return response.data.data;
}

export async function fetchMedicalService(id: string): Promise<MedicalServiceDetail> {
  const response = await apiClient.get<ApiResponse<MedicalServiceDetail>>(
    `/medical-services/${id}`,
  );
  return response.data.data;
}

export async function createMedicalService(
  data: CreateMedicalServiceRequest,
): Promise<MedicalServiceDetail> {
  const response = await apiClient.post<ApiResponse<MedicalServiceDetail>>(
    "/medical-services",
    data,
  );
  return response.data.data;
}

export async function updateMedicalService(
  id: string,
  data: UpdateMedicalServiceRequest,
): Promise<MedicalServiceDetail> {
  const response = await apiClient.put<ApiResponse<MedicalServiceDetail>>(
    `/medical-services/${id}`,
    data,
  );
  return response.data.data;
}

export async function deleteMedicalService(id: string): Promise<void> {
  await apiClient.delete(`/medical-services/${id}`);
}
