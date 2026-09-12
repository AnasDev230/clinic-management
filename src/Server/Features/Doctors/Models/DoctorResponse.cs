namespace Server.Features.Doctors.Models;

public class DoctorResponse
{
    public Guid Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string LicenseNumber { get; set; } = string.Empty;

    public int YearsOfExperience { get; set; }

    public string? Bio { get; set; }

    public string? ProfileImage { get; set; }

    public bool IsActive { get; set; }

    public Guid ApplicationUserId { get; set; }

    public string? TemporaryPassword { get; set; }

    public List<DoctorSpecialtyItem> Specialties { get; set; } = new();

    public List<DoctorScheduleItem> Schedules { get; set; } = new();

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
