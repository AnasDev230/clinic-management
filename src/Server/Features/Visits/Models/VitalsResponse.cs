namespace Server.Features.Visits.Models;

public class VitalsResponse
{
    public Guid Id { get; set; }

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

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
