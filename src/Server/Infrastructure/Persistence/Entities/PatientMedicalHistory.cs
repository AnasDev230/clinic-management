using Server.Core.Common;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Infrastructure.Persistence.Entities;

public class PatientMedicalHistory : BaseEntity
{
    public Guid PatientId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime? DiagnosedDate { get; set; }

    public MedicalHistoryStatus Status { get; set; } = MedicalHistoryStatus.Active;

    public Patient? Patient { get; set; }
}
