using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.LabTests.Models;

public class UpdateLabTestRequest
{
    public string TestName { get; set; } = string.Empty;

    public string? TestCategory { get; set; }

    public LabTestPriority Priority { get; set; } = LabTestPriority.Normal;

    public LabTestStatus Status { get; set; } = LabTestStatus.Ordered;

    public string? Notes { get; set; }

    public List<UpdateLabResultRequest>? Results { get; set; }
}
