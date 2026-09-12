namespace Server.Features.Doctors.Models;

public class CreateDoctorRequest
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string LicenseNumber { get; set; } = string.Empty;

    public int YearsOfExperience { get; set; }

    public string? Bio { get; set; }

    public List<Guid> SpecialtyIds { get; set; } = new();

    public List<CreateScheduleRequest> Schedules { get; set; } = new();
}
