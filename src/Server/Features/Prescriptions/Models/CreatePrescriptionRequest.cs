namespace Server.Features.Prescriptions.Models;

public class CreatePrescriptionRequest
{
    public Guid VisitId { get; set; }

    public string? Notes { get; set; }

    public DateTime? ValidUntil { get; set; }

    public List<CreatePrescriptionItemRequest> Items { get; set; } = new();
}
