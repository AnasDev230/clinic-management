import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types/auth";
import type { PagedResult } from "@/types/common";
import type {
  AllergyItem,
  CreateAllergyRequest,
  CreateInsuranceRequest,
  CreateMedicalHistoryRequest,
  CreatePatientRequest,
  InsuranceDetail,
  MedicalHistoryItem,
  PatientDetail,
  PatientDropdown,
  PatientListItem,
  UpdateAllergyRequest,
  UpdateInsuranceRequest,
  UpdateMedicalHistoryRequest,
  UpdatePatientRequest,
} from "@/types/patient";

export interface FetchPatientsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export async function fetchPatientsList(
  params: FetchPatientsParams = {},
): Promise<PagedResult<PatientListItem>> {
  const response = await apiClient.get<ApiResponse<PagedResult<PatientListItem>>>(
    "/patients",
    { params },
  );
  return response.data.data;
}

export async function fetchPatient(id: string): Promise<PatientDetail> {
  const response = await apiClient.get<ApiResponse<PatientDetail>>(
    `/patients/${id}`,
  );
  return response.data.data;
}

export async function fetchPatientsDropdown(): Promise<PatientDropdown[]> {
  const response = await apiClient.get<ApiResponse<PatientDropdown[]>>(
    "/patients/dropdown",
  );
  return response.data.data;
}

export async function createPatient(
  data: CreatePatientRequest,
): Promise<PatientDetail> {
  const response = await apiClient.post<ApiResponse<PatientDetail>>(
    "/patients",
    data,
  );
  return response.data.data;
}

export async function updatePatient(
  id: string,
  data: UpdatePatientRequest,
): Promise<PatientDetail> {
  const response = await apiClient.put<ApiResponse<PatientDetail>>(
    `/patients/${id}`,
    data,
  );
  return response.data.data;
}

export async function deletePatient(id: string): Promise<void> {
  await apiClient.delete(`/patients/${id}`);
}

export async function fetchMedicalHistory(
  patientId: string,
): Promise<MedicalHistoryItem[]> {
  const response = await apiClient.get<ApiResponse<MedicalHistoryItem[]>>(
    `/patients/${patientId}/medical-history`,
  );
  return response.data.data;
}

export async function createMedicalHistory(
  patientId: string,
  data: CreateMedicalHistoryRequest,
): Promise<MedicalHistoryItem> {
  const response = await apiClient.post<ApiResponse<MedicalHistoryItem>>(
    `/patients/${patientId}/medical-history`,
    data,
  );
  return response.data.data;
}

export async function updateMedicalHistory(
  patientId: string,
  id: string,
  data: UpdateMedicalHistoryRequest,
): Promise<MedicalHistoryItem> {
  const response = await apiClient.put<ApiResponse<MedicalHistoryItem>>(
    `/patients/${patientId}/medical-history/${id}`,
    data,
  );
  return response.data.data;
}

export async function deleteMedicalHistory(
  patientId: string,
  id: string,
): Promise<void> {
  await apiClient.delete(`/patients/${patientId}/medical-history/${id}`);
}

export async function fetchAllergies(patientId: string): Promise<AllergyItem[]> {
  const response = await apiClient.get<ApiResponse<AllergyItem[]>>(
    `/patients/${patientId}/allergies`,
  );
  return response.data.data;
}

export async function createAllergy(
  patientId: string,
  data: CreateAllergyRequest,
): Promise<AllergyItem> {
  const response = await apiClient.post<ApiResponse<AllergyItem>>(
    `/patients/${patientId}/allergies`,
    data,
  );
  return response.data.data;
}

export async function updateAllergy(
  patientId: string,
  id: string,
  data: UpdateAllergyRequest,
): Promise<AllergyItem> {
  const response = await apiClient.put<ApiResponse<AllergyItem>>(
    `/patients/${patientId}/allergies/${id}`,
    data,
  );
  return response.data.data;
}

export async function deleteAllergy(
  patientId: string,
  id: string,
): Promise<void> {
  await apiClient.delete(`/patients/${patientId}/allergies/${id}`);
}

export async function fetchInsurance(
  patientId: string,
): Promise<InsuranceDetail | null> {
  const response = await apiClient.get<ApiResponse<InsuranceDetail | null>>(
    `/patients/${patientId}/insurance`,
  );
  return response.data.data;
}

export async function saveInsurance(
  patientId: string,
  data: CreateInsuranceRequest,
): Promise<InsuranceDetail> {
  const response = await apiClient.put<ApiResponse<InsuranceDetail>>(
    `/patients/${patientId}/insurance`,
    data,
  );
  return response.data.data;
}

export async function deleteInsurance(patientId: string): Promise<void> {
  await apiClient.delete(`/patients/${patientId}/insurance`);
}
