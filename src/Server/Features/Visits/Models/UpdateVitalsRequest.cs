namespace Server.Features.Visits.Models;

public class UpdateVitalsRequest
{
    public decimal? Temperature { get; set; }

    public int? BloodPressureSystolic { get; set; }

    public int? BloodPressureDiastolic { get; set; }

    public int? HeartRate { get; set; }

    public int? RespiratoryRate { get; set; }

    public decimal? OxygenSaturation { get; set; }

    public decimal? Weight { get; set; }

    public decimal? Height { get; set; }

    public string? Notes { get; set; }
}
