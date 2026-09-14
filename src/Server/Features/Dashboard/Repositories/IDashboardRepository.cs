using Server.Features.Dashboard.Models;

namespace Server.Features.Dashboard.Repositories;

public interface IDashboardRepository
{
    Task<DashboardOverviewResponse> GetOverviewAsync();
    Task<TodaySummaryResponse> GetTodaySummaryAsync();
    Task<WeeklyStatsResponse> GetWeeklyStatsAsync(DateTime startDate);
    Task<MonthlyStatsResponse> GetMonthlyStatsAsync(int year, int month);
    Task<List<TopDoctorItem>> GetTopDoctorsAsync(int year, int month, int limit);
    Task<RevenueSummaryResponse> GetRevenueSummaryAsync(int year, int month);
    Task<List<AppointmentsByStatusResponse>> GetAppointmentsByStatusAsync(DateTime dateFrom, DateTime dateTo);
    Task<PatientsGrowthResponse> GetPatientsGrowthAsync(int months);
    Task<List<RecentActivityItem>> GetRecentActivityAsync(int count);
}
