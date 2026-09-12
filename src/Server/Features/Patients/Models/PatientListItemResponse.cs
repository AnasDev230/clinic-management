using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Patients.Models;

public class PatientListItemResponse
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }

    public Gender Gender { get; set; }

    public string Phone { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}
