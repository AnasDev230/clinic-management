namespace Server.Features.Prescriptions.Models;

public class UpdatePrescriptionItemRequest
{
    public Guid? Id { get; set; }

    public string MedicationName { get; set; } = string.Empty;

    public string? Dosage { get; set; }

    public string? Frequency { get; set; }

    public string? Duration { get; set; }

    public decimal? Quantity { get; set; }

    public string? Instructions { get; set; }
}
