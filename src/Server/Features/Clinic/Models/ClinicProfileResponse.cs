namespace Server.Features.Clinic.Models;

public class ClinicProfileResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Logo { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public TimeOnly WorkingHoursStart { get; set; }

    public TimeOnly WorkingHoursEnd { get; set; }

    public string? About { get; set; }
}
