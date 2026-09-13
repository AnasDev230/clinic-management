using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.LabTests.Models;

public class LabTestListItemResponse
{
    public Guid Id { get; set; }

    public string TestName { get; set; } = string.Empty;

    public string? TestCategory { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public DateTime OrderedDate { get; set; }

    public LabTestStatus Status { get; set; }

    public LabTestPriority Priority { get; set; }

    public int ResultCount { get; set; }
}
