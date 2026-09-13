import apiClient from "@/lib/api-client";
import type { ApiResponse, PagedResult } from "@/types/common";
import type {
  CreateVisitRequest,
  UpdateVisitRequest,
  VisitDetail,
  VisitListItem,
  VisitStatus,
} from "@/types/visit";

export interface FetchVisitsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  doctorId?: string;
  patientId?: string;
  status?: VisitStatus;
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchVisitsList(
  params: FetchVisitsParams = {},
): Promise<PagedResult<VisitListItem>> {
  const response = await apiClient.get<ApiResponse<PagedResult<VisitListItem>>>(
    "/visits",
    { params },
  );
  return response.data.data;
}

export async function fetchVisit(id: string): Promise<VisitDetail> {
  const response = await apiClient.get<ApiResponse<VisitDetail>>(
    `/visits/${id}`,
  );
  return response.data.data;
}

export async function fetchTodayVisits(): Promise<VisitListItem[]> {
  const response = await apiClient.get<ApiResponse<VisitListItem[]>>(
    "/visits/today",
  );
  return response.data.data;
}

export async function createVisit(
  data: CreateVisitRequest,
): Promise<VisitDetail> {
  const response = await apiClient.post<ApiResponse<VisitDetail>>(
    "/visits",
    data,
  );
  return response.data.data;
}

export async function updateVisit(
  id: string,
  data: UpdateVisitRequest,
): Promise<VisitDetail> {
  const response = await apiClient.put<ApiResponse<VisitDetail>>(
    `/visits/${id}`,
    data,
  );
  return response.data.data;
}

export async function startConsultation(id: string): Promise<VisitDetail> {
  const response = await apiClient.put<ApiResponse<VisitDetail>>(
    `/visits/${id}/start-consultation`,
  );
  return response.data.data;
}

export async function completeVisit(id: string): Promise<VisitDetail> {
  const response = await apiClient.put<ApiResponse<VisitDetail>>(
    `/visits/${id}/complete`,
  );
  return response.data.data;
}

export async function deleteVisit(id: string): Promise<void> {
  await apiClient.delete(`/visits/${id}`);
}
