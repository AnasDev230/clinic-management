using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Prescriptions.Models;

public class PrescriptionListItemResponse
{
    public Guid Id { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public string DoctorName { get; set; } = string.Empty;

    public DateTime PrescriptionDate { get; set; }

    public int ItemCount { get; set; }

    public PrescriptionStatus Status { get; set; }
}
