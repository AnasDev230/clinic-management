using Server.Core.Common;

namespace Server.Infrastructure.Persistence.Entities;

public class DoctorSpecialty : BaseEntity
{
    public Guid DoctorId { get; set; }

    public Guid SpecialtyId { get; set; }

    public Doctor? Doctor { get; set; }

    public Specialty? Specialty { get; set; }
}
