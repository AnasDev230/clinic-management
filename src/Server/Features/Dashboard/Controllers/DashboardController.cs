using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Core.Common;
using Server.Features.Dashboard.Models;
using Server.Features.Dashboard.Services;

namespace Server.Features.Dashboard.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;
    public DashboardController(IDashboardService service) => _service = service;

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        var result = await _service.GetOverviewAsync();
        return Ok(ApiResponse<DashboardOverviewResponse>.SuccessResult(result));
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetTodaySummary()
    {
        var result = await _service.GetTodaySummaryAsync();
        return Ok(ApiResponse<TodaySummaryResponse>.SuccessResult(result));
    }

    [HttpGet("weekly")]
    [Authorize(Roles = "SuperAdmin,Admin,Doctor")]
    public async Task<IActionResult> GetWeeklyStats()
    {
        var result = await _service.GetWeeklyStatsAsync();
        return Ok(ApiResponse<WeeklyStatsResponse>.SuccessResult(result));
    }

    [HttpGet("monthly")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> GetMonthlyStats(
        [FromQuery] int year = 0, [FromQuery] int month = 0)
    {
        var result = await _service.GetMonthlyStatsAsync(year, month);
        return Ok(ApiResponse<MonthlyStatsResponse>.SuccessResult(result));
    }

    [HttpGet("top-doctors")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> GetTopDoctors(
        [FromQuery] int year = 0, [FromQuery] int month = 0, [FromQuery] int limit = 5)
    {
        var result = await _service.GetTopDoctorsAsync(year, month, limit);
        return Ok(ApiResponse<List<TopDoctorItem>>.SuccessResult(result));
    }

    [HttpGet("revenue")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> GetRevenueSummary(
        [FromQuery] int year = 0, [FromQuery] int month = 0)
    {
        var result = await _service.GetRevenueSummaryAsync(year, month);
        return Ok(ApiResponse<RevenueSummaryResponse>.SuccessResult(result));
    }

    [HttpGet("appointments-by-status")]
    [Authorize(Roles = "SuperAdmin,Admin,Doctor")]
    public async Task<IActionResult> GetAppointmentsByStatus(
        [FromQuery] DateTime? from = null, [FromQuery] DateTime? to = null)
    {
        var now = DateTime.UtcNow;
        var result = await _service.GetAppointmentsByStatusAsync(
            from ?? now.AddDays(-30), to ?? now);
        return Ok(ApiResponse<List<AppointmentsByStatusResponse>>.SuccessResult(result));
    }

    [HttpGet("patients-growth")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> GetPatientsGrowth([FromQuery] int months = 6)
    {
        var result = await _service.GetPatientsGrowthAsync(months);
        return Ok(ApiResponse<PatientsGrowthResponse>.SuccessResult(result));
    }

    [HttpGet("recent-activity")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> GetRecentActivity([FromQuery] int count = 10)
    {
        var result = await _service.GetRecentActivityAsync(count);
        return Ok(ApiResponse<List<RecentActivityItem>>.SuccessResult(result));
    }
}
