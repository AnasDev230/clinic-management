namespace Server.Features.Visits.Models;

public class CreateVisitRequest
{
    public Guid AppointmentId { get; set; }

    public string? ChiefComplaint { get; set; }

    public string? Symptoms { get; set; }

    public string? Notes { get; set; }
}
