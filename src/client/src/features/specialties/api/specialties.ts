import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types/auth";
import type { PagedResult } from "@/types/common";
import type {
  CreateSpecialtyRequest,
  SpecialtyDetail,
  SpecialtyDropdownItem,
  SpecialtyListItem,
  UpdateSpecialtyRequest,
} from "@/types/specialty";

export interface FetchSpecialtiesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export async function fetchSpecialtiesList(
  params: FetchSpecialtiesParams = {},
): Promise<PagedResult<SpecialtyListItem>> {
  const response = await apiClient.get<ApiResponse<PagedResult<SpecialtyListItem>>>(
    "/specialties",
    { params },
  );
  return response.data.data;
}

export async function fetchSpecialty(id: string): Promise<SpecialtyDetail> {
  const response = await apiClient.get<ApiResponse<SpecialtyDetail>>(
    `/specialties/${id}`,
  );
  return response.data.data;
}

export async function fetchSpecialtiesDropdown(): Promise<
  SpecialtyDropdownItem[]
> {
  const response = await apiClient.get<ApiResponse<SpecialtyDropdownItem[]>>(
    "/specialties/dropdown",
  );
  return response.data.data;
}

export async function createSpecialty(
  data: CreateSpecialtyRequest,
): Promise<SpecialtyDetail> {
  const response = await apiClient.post<ApiResponse<SpecialtyDetail>>(
    "/specialties",
    data,
  );
  return response.data.data;
}

export async function updateSpecialty(
  id: string,
  data: UpdateSpecialtyRequest,
): Promise<SpecialtyDetail> {
  const response = await apiClient.put<ApiResponse<SpecialtyDetail>>(
    `/specialties/${id}`,
    data,
  );
  return response.data.data;
}

export async function deleteSpecialty(id: string): Promise<void> {
  await apiClient.delete(`/specialties/${id}`);
}
