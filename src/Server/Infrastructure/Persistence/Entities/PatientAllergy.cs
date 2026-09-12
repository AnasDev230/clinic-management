using Server.Core.Common;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Infrastructure.Persistence.Entities;

public class PatientAllergy : BaseEntity
{
    public Guid PatientId { get; set; }

    public string Name { get; set; } = string.Empty;

    public AllergyType Type { get; set; } = AllergyType.Other;

    public AllergySeverity Severity { get; set; } = AllergySeverity.Mild;

    public string? Notes { get; set; }

    public Patient? Patient { get; set; }
}
