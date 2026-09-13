import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types/common";
import type {
  CreateFollowUpRequest,
  FollowUpItem,
  UpdateFollowUpRequest,
} from "@/types/appointment";

export async function fetchFollowUps(
  appointmentId: string,
): Promise<FollowUpItem[]> {
  const response = await apiClient.get<ApiResponse<FollowUpItem[]>>(
    `/appointments/${appointmentId}/follow-ups`,
  );
  return response.data.data;
}

export async function createFollowUp(
  appointmentId: string,
  data: CreateFollowUpRequest,
): Promise<FollowUpItem> {
  const response = await apiClient.post<ApiResponse<FollowUpItem>>(
    `/appointments/${appointmentId}/follow-ups`,
    data,
  );
  return response.data.data;
}

export async function updateFollowUp(
  appointmentId: string,
  id: string,
  data: UpdateFollowUpRequest,
): Promise<FollowUpItem> {
  const response = await apiClient.put<ApiResponse<FollowUpItem>>(
    `/appointments/${appointmentId}/follow-ups/${id}`,
    data,
  );
  return response.data.data;
}

export async function completeFollowUp(
  appointmentId: string,
  id: string,
): Promise<FollowUpItem> {
  const response = await apiClient.put<ApiResponse<FollowUpItem>>(
    `/appointments/${appointmentId}/follow-ups/${id}/complete`,
  );
  return response.data.data;
}

export async function deleteFollowUp(
  appointmentId: string,
  id: string,
): Promise<void> {
  await apiClient.delete(`/appointments/${appointmentId}/follow-ups/${id}`);
}
