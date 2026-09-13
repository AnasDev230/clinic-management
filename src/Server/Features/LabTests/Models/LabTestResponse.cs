using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.LabTests.Models;

public class LabTestResponse
{
    public Guid Id { get; set; }

    public Guid VisitId { get; set; }

    public Guid PatientId { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public Guid DoctorId { get; set; }

    public string DoctorName { get; set; } = string.Empty;

    public string OrderedByDoctorName { get; set; } = string.Empty;

    public string TestName { get; set; } = string.Empty;

    public string? TestCategory { get; set; }

    public DateTime OrderedDate { get; set; }

    public LabTestStatus Status { get; set; }

    public LabTestPriority Priority { get; set; }

    public string? Notes { get; set; }

    public List<LabResultResponse> Results { get; set; } = new();

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
