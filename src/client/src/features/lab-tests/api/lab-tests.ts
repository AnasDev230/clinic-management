import apiClient from "@/lib/api-client";
import type { ApiResponse, PagedResult } from "@/types/common";
import type {
  CreateLabResultRequest,
  CreateLabTestRequest,
  LabTestDetail,
  LabTestListItem,
  LabTestPriority,
  LabTestStatus,
  UpdateLabTestRequest,
} from "@/types/lab-test";

export interface FetchLabTestsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  doctorId?: string;
  patientId?: string;
  status?: LabTestStatus;
  category?: string;
}

export async function fetchLabTestsList(
  params: FetchLabTestsParams = {},
): Promise<PagedResult<LabTestListItem>> {
  const response = await apiClient.get<ApiResponse<PagedResult<LabTestListItem>>>(
    "/lab-tests",
    { params },
  );
  return response.data.data;
}

export async function fetchLabTest(id: string): Promise<LabTestDetail> {
  const response = await apiClient.get<ApiResponse<LabTestDetail>>(
    `/lab-tests/${id}`,
  );
  return response.data.data;
}

export async function fetchLabTestsByVisit(visitId: string): Promise<LabTestDetail[]> {
  const response = await apiClient.get<ApiResponse<LabTestDetail[]>>(
    `/lab-tests/visit/${visitId}`,
  );
  return response.data.data;
}

export async function fetchLabTestsByPatient(
  patientId: string,
  params: { page?: number; pageSize?: number } = {},
): Promise<PagedResult<LabTestListItem>> {
  const response = await apiClient.get<ApiResponse<PagedResult<LabTestListItem>>>(
    `/lab-tests/patient/${patientId}`,
    { params },
  );
  return response.data.data;
}

export async function createLabTest(data: CreateLabTestRequest): Promise<LabTestDetail> {
  const response = await apiClient.post<ApiResponse<LabTestDetail>>("/lab-tests", data);
  return response.data.data;
}

export async function updateLabTest(
  id: string,
  data: UpdateLabTestRequest,
): Promise<LabTestDetail> {
  const response = await apiClient.put<ApiResponse<LabTestDetail>>(
    `/lab-tests/${id}`,
    data,
  );
  return response.data.data;
}

export async function startLabTest(id: string): Promise<LabTestDetail> {
  const response = await apiClient.put<ApiResponse<LabTestDetail>>(
    `/lab-tests/${id}/start`,
  );
  return response.data.data;
}

export async function completeLabTest(
  id: string,
  results: CreateLabResultRequest[] = [],
): Promise<LabTestDetail> {
  const response = await apiClient.put<ApiResponse<LabTestDetail>>(
    `/lab-tests/${id}/complete`,
    results,
  );
  return response.data.data;
}

export async function cancelLabTest(id: string): Promise<LabTestDetail> {
  const response = await apiClient.put<ApiResponse<LabTestDetail>>(
    `/lab-tests/${id}/cancel`,
  );
  return response.data.data;
}

export async function deleteLabTest(id: string): Promise<void> {
  await apiClient.delete(`/lab-tests/${id}`);
}

export type { LabTestPriority };
