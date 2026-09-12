namespace Server.Features.Patients.Models;

public class PatientDropdownResponse
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;
}
