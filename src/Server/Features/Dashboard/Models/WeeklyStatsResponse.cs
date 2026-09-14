namespace Server.Features.Dashboard.Models;

public class WeeklyStatsResponse
{
    public List<DailyStat> Days { get; set; } = new();
    public int TotalAppointments { get; set; }
    public decimal TotalRevenue { get; set; }
}

public class DailyStat
{
    public string DayName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int AppointmentsCount { get; set; }
    public decimal Revenue { get; set; }
}
