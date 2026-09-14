import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types/common";
import type {
  AppointmentsByStatus,
  DashboardOverview,
  MonthlyStats,
  PatientsGrowth,
  RecentActivityItem,
  RevenueSummary,
  TodaySummary,
  TopDoctorItem,
  WeeklyStats,
} from "@/types/dashboard";

export async function fetchOverview(): Promise<DashboardOverview> {
  const response =
    await apiClient.get<ApiResponse<DashboardOverview>>("/dashboard/overview");
  return response.data.data;
}

export async function fetchTodaySummary(): Promise<TodaySummary> {
  const response =
    await apiClient.get<ApiResponse<TodaySummary>>("/dashboard/today");
  return response.data.data;
}

export async function fetchWeeklyStats(): Promise<WeeklyStats> {
  const response =
    await apiClient.get<ApiResponse<WeeklyStats>>("/dashboard/weekly");
  return response.data.data;
}

export async function fetchMonthlyStats(
  year: number,
  month: number,
): Promise<MonthlyStats> {
  const response = await apiClient.get<ApiResponse<MonthlyStats>>(
    "/dashboard/monthly",
    { params: { year, month } },
  );
  return response.data.data;
}

export async function fetchTopDoctors(
  year: number,
  month: number,
  limit = 5,
): Promise<TopDoctorItem[]> {
  const response = await apiClient.get<ApiResponse<TopDoctorItem[]>>(
    "/dashboard/top-doctors",
    { params: { year, month, limit } },
  );
  return response.data.data;
}

export async function fetchRevenueSummary(
  year: number,
  month: number,
): Promise<RevenueSummary> {
  const response = await apiClient.get<ApiResponse<RevenueSummary>>(
    "/dashboard/revenue",
    { params: { year, month } },
  );
  return response.data.data;
}

export async function fetchAppointmentsByStatus(
  from: string,
  to: string,
): Promise<AppointmentsByStatus[]> {
  const response = await apiClient.get<ApiResponse<AppointmentsByStatus[]>>(
    "/dashboard/appointments-by-status",
    { params: { from, to } },
  );
  return response.data.data;
}

export async function fetchPatientsGrowth(
  months = 6,
): Promise<PatientsGrowth> {
  const response = await apiClient.get<ApiResponse<PatientsGrowth>>(
    "/dashboard/patients-growth",
    { params: { months } },
  );
  return response.data.data;
}

export async function fetchRecentActivity(
  count = 10,
): Promise<RecentActivityItem[]> {
  const response = await apiClient.get<ApiResponse<RecentActivityItem[]>>(
    "/dashboard/recent-activity",
    { params: { count } },
  );
  return response.data.data;
}
