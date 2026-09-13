using Server.Core.Common;

namespace Server.Infrastructure.Persistence.Entities;

public class VisitVitals : BaseEntity
{
    public Guid VisitId { get; set; }

    public decimal? Temperature { get; set; }

    public int? BloodPressureSystolic { get; set; }

    public int? BloodPressureDiastolic { get; set; }

    public int? HeartRate { get; set; }

    public int? RespiratoryRate { get; set; }

    public decimal? OxygenSaturation { get; set; }

    public decimal? Weight { get; set; }

    public decimal? Height { get; set; }

    public decimal? BMI { get; set; }

    public string? Notes { get; set; }

    public Visit? Visit { get; set; }
}
