namespace Server.Features.Dashboard.Models;

public class AppointmentsByStatusResponse
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}
