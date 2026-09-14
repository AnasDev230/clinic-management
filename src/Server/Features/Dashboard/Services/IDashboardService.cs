using Server.Features.Dashboard.Models;

namespace Server.Features.Dashboard.Services;

public interface IDashboardService
{
    Task<DashboardOverviewResponse> GetOverviewAsync();
    Task<TodaySummaryResponse> GetTodaySummaryAsync();
    Task<WeeklyStatsResponse> GetWeeklyStatsAsync();
    Task<MonthlyStatsResponse> GetMonthlyStatsAsync(int year, int month);
    Task<List<TopDoctorItem>> GetTopDoctorsAsync(int year, int month, int limit);
    Task<RevenueSummaryResponse> GetRevenueSummaryAsync(int year, int month);
    Task<List<AppointmentsByStatusResponse>> GetAppointmentsByStatusAsync(DateTime dateFrom, DateTime dateTo);
    Task<PatientsGrowthResponse> GetPatientsGrowthAsync(int months);
    Task<List<RecentActivityItem>> GetRecentActivityAsync(int count);
}
