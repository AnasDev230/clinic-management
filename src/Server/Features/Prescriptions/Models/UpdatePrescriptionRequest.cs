using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Prescriptions.Models;

public class UpdatePrescriptionRequest
{
    public string? Notes { get; set; }

    public DateTime? ValidUntil { get; set; }

    public PrescriptionStatus Status { get; set; } = PrescriptionStatus.Active;

    public List<UpdatePrescriptionItemRequest> Items { get; set; } = new();
}
