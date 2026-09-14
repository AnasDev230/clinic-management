namespace Server.Features.Dashboard.Models;

public class MonthlyStatsResponse
{
    public int Year { get; set; }
    public int Month { get; set; }
    public int TotalAppointments { get; set; }
    public int TotalVisits { get; set; }
    public int TotalPatients { get; set; }
    public int NewPatients { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal TotalPaid { get; set; }
    public decimal TotalOutstanding { get; set; }
    public int TotalLabTests { get; set; }
    public int TotalPrescriptions { get; set; }
    public List<DailyStat> DailyBreakdown { get; set; } = new();
}
