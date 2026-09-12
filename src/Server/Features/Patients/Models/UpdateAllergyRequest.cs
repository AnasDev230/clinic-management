using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Patients.Models;

public class UpdateAllergyRequest
{
    public string Name { get; set; } = string.Empty;

    public AllergyType Type { get; set; } = AllergyType.Other;

    public AllergySeverity Severity { get; set; } = AllergySeverity.Mild;

    public string? Notes { get; set; }
}
