using Server.Core.Common;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Infrastructure.Persistence.Entities;

public class Prescription : BaseEntity
{
    public Guid VisitId { get; set; }

    public Guid PatientId { get; set; }

    public Guid DoctorId { get; set; }

    public DateTime PrescriptionDate { get; set; } = DateTime.UtcNow;

    public string? Notes { get; set; }

    public PrescriptionStatus Status { get; set; } = PrescriptionStatus.Active;

    public DateTime? ValidUntil { get; set; }

    public Visit? Visit { get; set; }

    public Patient? Patient { get; set; }

    public Doctor? Doctor { get; set; }

    public ICollection<PrescriptionItem> Items { get; set; } = new List<PrescriptionItem>();
}
