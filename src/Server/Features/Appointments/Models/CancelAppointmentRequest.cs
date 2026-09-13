namespace Server.Features.Appointments.Models;

public class CancelAppointmentRequest
{
    public string CancellationReason { get; set; } = string.Empty;
}
