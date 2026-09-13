using Server.Core.Common;

namespace Server.Infrastructure.Persistence.Entities;

public class ServiceCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int SortOrder { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    public ICollection<MedicalService> MedicalServices { get; set; } = new List<MedicalService>();
}
