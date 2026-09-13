using Server.Core.Common;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Infrastructure.Persistence.Entities;

public class Visit : BaseEntity
{
    public Guid AppointmentId { get; set; }

    public Guid PatientId { get; set; }

    public Guid DoctorId { get; set; }

    public DateTime VisitDate { get; set; }

    public string? ChiefComplaint { get; set; }

    public string? Symptoms { get; set; }

    public string? Diagnosis { get; set; }

    public string? TreatmentPlan { get; set; }

    public string? Notes { get; set; }

    public VisitStatus Status { get; set; } = VisitStatus.Waiting;

    public bool NextVisitRecommended { get; set; } = false;

    public string? NextVisitNotes { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal FinalAmount { get; set; }

    public Appointment? Appointment { get; set; }

    public Patient? Patient { get; set; }

    public Doctor? Doctor { get; set; }

    public ICollection<VisitDiagnosis> Diagnoses { get; set; } = new List<VisitDiagnosis>();

    public VisitVitals? Vitals { get; set; }
}
