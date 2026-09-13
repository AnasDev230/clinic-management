using Server.Core.Common;

namespace Server.Infrastructure.Persistence.Entities;

public class MedicalService : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public Guid CategoryId { get; set; }

    public decimal Price { get; set; }

    public int DurationMinutes { get; set; } = 30;

    public bool IsActive { get; set; } = true;

    public bool RequiresAppointment { get; set; } = true;

    public int SortOrder { get; set; } = 0;

    public ServiceCategory? Category { get; set; }
}
