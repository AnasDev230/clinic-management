using Server.Core.Common;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Infrastructure.Persistence.Entities;

public class LabTest : BaseEntity
{
    public Guid VisitId { get; set; }

    public Guid PatientId { get; set; }

    public Guid DoctorId { get; set; }

    public string TestName { get; set; } = string.Empty;

    public string? TestCategory { get; set; }

    public DateTime OrderedDate { get; set; } = DateTime.UtcNow;

    public LabTestStatus Status { get; set; } = LabTestStatus.Ordered;

    public LabTestPriority Priority { get; set; } = LabTestPriority.Normal;

    public string? Notes { get; set; }

    public Guid OrderedByDoctorId { get; set; }

    public Guid? PerformedByDoctorId { get; set; }

    public Visit? Visit { get; set; }

    public Patient? Patient { get; set; }

    public Doctor? Doctor { get; set; }

    public Doctor? OrderedByDoctor { get; set; }

    public Doctor? PerformedByDoctor { get; set; }

    public ICollection<LabResult> Results { get; set; } = new List<LabResult>();
}
