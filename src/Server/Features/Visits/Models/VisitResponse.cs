using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Visits.Models;

public class VisitResponse
{
    public Guid Id { get; set; }

    public Guid AppointmentId { get; set; }

    public DateTime AppointmentDate { get; set; }

    public Guid PatientId { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public Guid DoctorId { get; set; }

    public string DoctorName { get; set; } = string.Empty;

    public DateTime VisitDate { get; set; }

    public string? ChiefComplaint { get; set; }

    public string? Symptoms { get; set; }

    public string? Diagnosis { get; set; }

    public string? TreatmentPlan { get; set; }

    public string? Notes { get; set; }

    public VisitStatus Status { get; set; }

    public bool NextVisitRecommended { get; set; }

    public string? NextVisitNotes { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal FinalAmount { get; set; }

    public List<DiagnosisResponse> Diagnoses { get; set; } = new();

    public VitalsResponse? Vitals { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
