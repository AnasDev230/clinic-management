using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Patients.Models;

public class MedicalHistoryResponse
{
    public Guid Id { get; set; }

    public Guid PatientId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime? DiagnosedDate { get; set; }

    public MedicalHistoryStatus Status { get; set; }
}
