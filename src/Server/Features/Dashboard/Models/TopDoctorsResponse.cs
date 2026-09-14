namespace Server.Features.Dashboard.Models;

public class TopDoctorsResponse
{
    public List<TopDoctorItem> Doctors { get; set; } = new();
}

public class TopDoctorItem
{
    public Guid DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string SpecialtyName { get; set; } = string.Empty;
    public int AppointmentsCount { get; set; }
    public int CompletedVisits { get; set; }
    public decimal Revenue { get; set; }
}
