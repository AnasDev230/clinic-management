using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.LabTests.Models;

public class CreateLabTestRequest
{
    public Guid VisitId { get; set; }

    public string TestName { get; set; } = string.Empty;

    public string? TestCategory { get; set; }

    public LabTestPriority Priority { get; set; } = LabTestPriority.Normal;

    public string? Notes { get; set; }

    public List<CreateLabResultRequest>? Results { get; set; }
}
