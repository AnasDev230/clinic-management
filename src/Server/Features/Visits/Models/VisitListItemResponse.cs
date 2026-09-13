using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Visits.Models;

public class VisitListItemResponse
{
    public Guid Id { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public string DoctorName { get; set; } = string.Empty;

    public DateTime VisitDate { get; set; }

    public VisitStatus Status { get; set; }

    public decimal TotalAmount { get; set; }
}
