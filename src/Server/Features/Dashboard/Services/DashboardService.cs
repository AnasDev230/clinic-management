using Server.Features.Dashboard.Models;
using Server.Features.Dashboard.Repositories;

namespace Server.Features.Dashboard.Services;

public class DashboardService : IDashboardService
{
    private readonly IDashboardRepository _repository;

    public DashboardService(IDashboardRepository repository)
    {
        _repository = repository;
    }

    public Task<DashboardOverviewResponse> GetOverviewAsync()
        => _repository.GetOverviewAsync();

    public Task<TodaySummaryResponse> GetTodaySummaryAsync()
        => _repository.GetTodaySummaryAsync();

    public Task<WeeklyStatsResponse> GetWeeklyStatsAsync()
    {
        var startDate = DateTime.UtcNow.Date.AddDays(-6);
        return _repository.GetWeeklyStatsAsync(startDate);
    }

    public Task<MonthlyStatsResponse> GetMonthlyStatsAsync(int year, int month)
    {
        var (normalizedYear, normalizedMonth) = NormalizeYearMonth(year, month);
        return _repository.GetMonthlyStatsAsync(normalizedYear, normalizedMonth);
    }

    public Task<List<TopDoctorItem>> GetTopDoctorsAsync(int year, int month, int limit)
    {
        var (normalizedYear, normalizedMonth) = NormalizeYearMonth(year, month);
        return _repository.GetTopDoctorsAsync(normalizedYear, normalizedMonth, limit);
    }

    public Task<RevenueSummaryResponse> GetRevenueSummaryAsync(int year, int month)
    {
        var (normalizedYear, normalizedMonth) = NormalizeYearMonth(year, month);
        return _repository.GetRevenueSummaryAsync(normalizedYear, normalizedMonth);
    }

    public Task<List<AppointmentsByStatusResponse>> GetAppointmentsByStatusAsync(
        DateTime dateFrom, DateTime dateTo)
    {
        if (dateTo < dateFrom)
            (dateFrom, dateTo) = (dateTo, dateFrom);

        return _repository.GetAppointmentsByStatusAsync(dateFrom, dateTo);
    }

    public Task<PatientsGrowthResponse> GetPatientsGrowthAsync(int months)
        => _repository.GetPatientsGrowthAsync(months);

    public Task<List<RecentActivityItem>> GetRecentActivityAsync(int count)
        => _repository.GetRecentActivityAsync(count);

    private static (int Year, int Month) NormalizeYearMonth(int year, int month)
    {
        var now = DateTime.UtcNow;
        if (year < 2000 || year > 2100)
            year = now.Year;
        if (month < 1 || month > 12)
            month = now.Month;

        return (year, month);
    }
}
