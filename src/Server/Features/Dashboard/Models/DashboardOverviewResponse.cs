namespace Server.Features.Dashboard.Models;

public class DashboardOverviewResponse
{
    public int TotalPatients { get; set; }
    public int TotalDoctors { get; set; }
    public int TodayAppointments { get; set; }
    public decimal TodayRevenue { get; set; }
    public int PendingLabTests { get; set; }
    public int OverdueInvoices { get; set; }
    public decimal MonthlyRevenue { get; set; }
    public int NewPatientsThisMonth { get; set; }
}
