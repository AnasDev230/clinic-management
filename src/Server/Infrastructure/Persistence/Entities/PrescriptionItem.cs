using Server.Core.Common;

namespace Server.Infrastructure.Persistence.Entities;

public class PrescriptionItem : BaseEntity
{
    public Guid PrescriptionId { get; set; }

    public string MedicationName { get; set; } = string.Empty;

    public string? Dosage { get; set; }

    public string? Frequency { get; set; }

    public string? Duration { get; set; }

    public decimal? Quantity { get; set; }

    public string? Instructions { get; set; }

    public int SortOrder { get; set; } = 0;

    public Prescription? Prescription { get; set; }
}
