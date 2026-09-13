using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Prescriptions.Models;

public class PrescriptionResponse
{
    public Guid Id { get; set; }

    public Guid VisitId { get; set; }

    public DateTime VisitDate { get; set; }

    public Guid PatientId { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public Guid DoctorId { get; set; }

    public string DoctorName { get; set; } = string.Empty;

    public DateTime PrescriptionDate { get; set; }

    public string? Notes { get; set; }

    public PrescriptionStatus Status { get; set; }

    public DateTime? ValidUntil { get; set; }

    public List<PrescriptionItemResponse> Items { get; set; } = new();

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
