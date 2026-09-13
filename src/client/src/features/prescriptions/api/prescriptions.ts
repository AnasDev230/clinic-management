import apiClient from "@/lib/api-client";
import type { ApiResponse, PagedResult } from "@/types/common";
import type {
  CreatePrescriptionRequest,
  PrescriptionDetail,
  PrescriptionListItem,
  PrescriptionStatus,
  UpdatePrescriptionRequest,
} from "@/types/prescription";

export interface FetchPrescriptionsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  doctorId?: string;
  patientId?: string;
  status?: PrescriptionStatus;
}

export async function fetchPrescriptionsList(
  params: FetchPrescriptionsParams = {},
): Promise<PagedResult<PrescriptionListItem>> {
  const response = await apiClient.get<
    ApiResponse<PagedResult<PrescriptionListItem>>
  >("/prescriptions", { params });
  return response.data.data;
}

export async function fetchPrescription(id: string): Promise<PrescriptionDetail> {
  const response = await apiClient.get<ApiResponse<PrescriptionDetail>>(
    `/prescriptions/${id}`,
  );
  return response.data.data;
}

export async function fetchPrescriptionsByVisit(
  visitId: string,
): Promise<PrescriptionDetail[]> {
  const response = await apiClient.get<ApiResponse<PrescriptionDetail[]>>(
    `/prescriptions/visit/${visitId}`,
  );
  return response.data.data;
}

export async function fetchPrescriptionsByPatient(
  patientId: string,
  params: { page?: number; pageSize?: number } = {},
): Promise<PagedResult<PrescriptionListItem>> {
  const response = await apiClient.get<
    ApiResponse<PagedResult<PrescriptionListItem>>
  >(`/prescriptions/patient/${patientId}`, { params });
  return response.data.data;
}

export async function createPrescription(
  data: CreatePrescriptionRequest,
): Promise<PrescriptionDetail> {
  const response = await apiClient.post<ApiResponse<PrescriptionDetail>>(
    "/prescriptions",
    data,
  );
  return response.data.data;
}

export async function updatePrescription(
  id: string,
  data: UpdatePrescriptionRequest,
): Promise<PrescriptionDetail> {
  const response = await apiClient.put<ApiResponse<PrescriptionDetail>>(
    `/prescriptions/${id}`,
    data,
  );
  return response.data.data;
}

export async function completePrescription(id: string): Promise<PrescriptionDetail> {
  const response = await apiClient.put<ApiResponse<PrescriptionDetail>>(
    `/prescriptions/${id}/complete`,
  );
  return response.data.data;
}

export async function cancelPrescription(id: string): Promise<PrescriptionDetail> {
  const response = await apiClient.put<ApiResponse<PrescriptionDetail>>(
    `/prescriptions/${id}/cancel`,
  );
  return response.data.data;
}

export async function deletePrescription(id: string): Promise<void> {
  await apiClient.delete(`/prescriptions/${id}`);
}
