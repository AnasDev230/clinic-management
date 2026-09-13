import apiClient from "@/lib/api-client";
import type { ApiResponse, PagedResult } from "@/types/common";
import type {
  AppointmentCalendarItem,
  AppointmentDetail,
  AppointmentListItem,
  AppointmentStatus,
  CancelAppointmentRequest,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from "@/types/appointment";

export interface FetchAppointmentsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  doctorId?: string;
  patientId?: string;
  status?: AppointmentStatus;
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchAppointmentsList(
  params: FetchAppointmentsParams = {},
): Promise<PagedResult<AppointmentListItem>> {
  const response = await apiClient.get<
    ApiResponse<PagedResult<AppointmentListItem>>
  >("/appointments", { params });
  return response.data.data;
}

export async function fetchAppointment(id: string): Promise<AppointmentDetail> {
  const response = await apiClient.get<ApiResponse<AppointmentDetail>>(
    `/appointments/${id}`,
  );
  return response.data.data;
}

export async function fetchTodayAppointments(): Promise<
  AppointmentCalendarItem[]
> {
  const response = await apiClient.get<ApiResponse<AppointmentCalendarItem[]>>(
    "/appointments/today",
  );
  return response.data.data;
}

export async function fetchAppointmentsByDoctorAndDate(
  doctorId: string,
  date: string,
): Promise<AppointmentCalendarItem[]> {
  const response = await apiClient.get<ApiResponse<AppointmentCalendarItem[]>>(
    `/appointments/doctor/${doctorId}/date/${date}`,
  );
  return response.data.data;
}

export async function createAppointment(
  data: CreateAppointmentRequest,
): Promise<AppointmentDetail> {
  const response = await apiClient.post<ApiResponse<AppointmentDetail>>(
    "/appointments",
    data,
  );
  return response.data.data;
}

export async function updateAppointment(
  id: string,
  data: UpdateAppointmentRequest,
): Promise<AppointmentDetail> {
  const response = await apiClient.put<ApiResponse<AppointmentDetail>>(
    `/appointments/${id}`,
    data,
  );
  return response.data.data;
}

export async function confirmAppointment(id: string): Promise<AppointmentDetail> {
  const response = await apiClient.put<ApiResponse<AppointmentDetail>>(
    `/appointments/${id}/confirm`,
  );
  return response.data.data;
}

export async function startAppointment(id: string): Promise<AppointmentDetail> {
  const response = await apiClient.put<ApiResponse<AppointmentDetail>>(
    `/appointments/${id}/start`,
  );
  return response.data.data;
}

export async function completeAppointment(
  id: string,
): Promise<AppointmentDetail> {
  const response = await apiClient.put<ApiResponse<AppointmentDetail>>(
    `/appointments/${id}/complete`,
  );
  return response.data.data;
}

export async function cancelAppointment(
  id: string,
  data: CancelAppointmentRequest,
): Promise<AppointmentDetail> {
  const response = await apiClient.put<ApiResponse<AppointmentDetail>>(
    `/appointments/${id}/cancel`,
    data,
  );
  return response.data.data;
}

export async function markAppointmentNoShow(
  id: string,
): Promise<AppointmentDetail> {
  const response = await apiClient.put<ApiResponse<AppointmentDetail>>(
    `/appointments/${id}/no-show`,
  );
  return response.data.data;
}

export async function deleteAppointment(id: string): Promise<void> {
  await apiClient.delete(`/appointments/${id}`);
}
