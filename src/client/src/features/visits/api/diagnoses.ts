import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types/common";
import type {
  CreateDiagnosisRequest,
  DiagnosisItem,
  UpdateDiagnosisRequest,
} from "@/types/visit";

export async function fetchDiagnoses(
  visitId: string,
): Promise<DiagnosisItem[]> {
  const response = await apiClient.get<ApiResponse<DiagnosisItem[]>>(
    `/visits/${visitId}/diagnoses`,
  );
  return response.data.data;
}

export async function createDiagnosis(
  visitId: string,
  data: CreateDiagnosisRequest,
): Promise<DiagnosisItem> {
  const response = await apiClient.post<ApiResponse<DiagnosisItem>>(
    `/visits/${visitId}/diagnoses`,
    data,
  );
  return response.data.data;
}

export async function updateDiagnosis(
  visitId: string,
  id: string,
  data: UpdateDiagnosisRequest,
): Promise<DiagnosisItem> {
  const response = await apiClient.put<ApiResponse<DiagnosisItem>>(
    `/visits/${visitId}/diagnoses/${id}`,
    data,
  );
  return response.data.data;
}

export async function deleteDiagnosis(
  visitId: string,
  id: string,
): Promise<void> {
  await apiClient.delete(`/visits/${visitId}/diagnoses/${id}`);
}
