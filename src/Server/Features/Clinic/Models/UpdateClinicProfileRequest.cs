namespace Server.Features.Clinic.Models;

public class UpdateClinicProfileRequest
{
    public string Name { get; set; } = string.Empty;

    public string? Logo { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public TimeOnly WorkingHoursStart { get; set; } = new(9, 0);

    public TimeOnly WorkingHoursEnd { get; set; } = new(21, 0);

    public string? About { get; set; }
}
