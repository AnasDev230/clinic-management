namespace Server.Features.Prescriptions.Models;

public class PrescriptionItemResponse
{
    public Guid Id { get; set; }

    public Guid PrescriptionId { get; set; }

    public string MedicationName { get; set; } = string.Empty;

    public string? Dosage { get; set; }

    public string? Frequency { get; set; }

    public string? Duration { get; set; }

    public decimal? Quantity { get; set; }

    public string? Instructions { get; set; }

    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
