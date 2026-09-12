using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Patients.Models;

public class AllergyResponse
{
    public Guid Id { get; set; }

    public Guid PatientId { get; set; }

    public string Name { get; set; } = string.Empty;

    public AllergyType Type { get; set; }

    public AllergySeverity Severity { get; set; }

    public string? Notes { get; set; }
}
