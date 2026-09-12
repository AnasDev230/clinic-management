namespace Server.Features.Doctors.Models;

public class DoctorListItemResponse
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string LicenseNumber { get; set; } = string.Empty;

    public List<string> Specialties { get; set; } = new();

    public bool IsActive { get; set; }
}
