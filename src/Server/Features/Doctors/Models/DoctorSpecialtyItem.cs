namespace Server.Features.Doctors.Models;

public class DoctorSpecialtyItem
{
    public Guid SpecialtyId { get; set; }

    public string SpecialtyName { get; set; } = string.Empty;
}
