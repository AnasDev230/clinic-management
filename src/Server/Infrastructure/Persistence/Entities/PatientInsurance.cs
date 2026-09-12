using Server.Core.Common;

namespace Server.Infrastructure.Persistence.Entities;

public class PatientInsurance : BaseEntity
{
    public Guid PatientId { get; set; }

    public string ProviderName { get; set; } = string.Empty;

    public string PolicyNumber { get; set; } = string.Empty;

    public string? GroupNumber { get; set; }

    public DateTime ExpiryDate { get; set; }

    public decimal CoveragePercentage { get; set; }

    public bool IsActive { get; set; } = true;

    public Patient? Patient { get; set; }
}
