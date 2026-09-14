namespace Server.Features.Dashboard.Models;

public class TodaySummaryResponse
{
    public int TotalAppointments { get; set; }
    public int CompletedAppointments { get; set; }
    public int CancelledAppointments { get; set; }
    public int WaitingPatients { get; set; }
    public int InConsultation { get; set; }
    public decimal TodayRevenue { get; set; }
    public int TodayVisits { get; set; }
    public List<TodayAppointmentItem> UpcomingAppointments { get; set; } = new();
}

public class TodayAppointmentItem
{
    public Guid Id { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}
