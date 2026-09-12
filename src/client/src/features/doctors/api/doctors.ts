import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types/auth";
import type { PagedResult } from "@/types/common";
import type {
  CreateDoctorRequest,
  DoctorDetail,
  DoctorDropdown,
  DoctorListItem,
  UpdateDoctorRequest,
} from "@/types/doctor";

export interface FetchDoctorsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  specialtyId?: string;
}

export async function fetchDoctorsList(
  params: FetchDoctorsParams = {},
): Promise<PagedResult<DoctorListItem>> {
  const response = await apiClient.get<ApiResponse<PagedResult<DoctorListItem>>>(
    "/doctors",
    { params },
  );
  return response.data.data;
}

export async function fetchDoctor(id: string): Promise<DoctorDetail> {
  const response = await apiClient.get<ApiResponse<DoctorDetail>>(
    `/doctors/${id}`,
  );
  return response.data.data;
}

export async function fetchDoctorsDropdown(): Promise<DoctorDropdown[]> {
  const response = await apiClient.get<ApiResponse<DoctorDropdown[]>>(
    "/doctors/dropdown",
  );
  return response.data.data;
}

export async function createDoctor(
  data: CreateDoctorRequest,
): Promise<DoctorDetail> {
  const response = await apiClient.post<ApiResponse<DoctorDetail>>(
    "/doctors",
    data,
  );
  return response.data.data;
}

export async function updateDoctor(
  id: string,
  data: UpdateDoctorRequest,
): Promise<DoctorDetail> {
  const response = await apiClient.put<ApiResponse<DoctorDetail>>(
    `/doctors/${id}`,
    data,
  );
  return response.data.data;
}

export async function deleteDoctor(id: string): Promise<void> {
  await apiClient.delete(`/doctors/${id}`);
}
