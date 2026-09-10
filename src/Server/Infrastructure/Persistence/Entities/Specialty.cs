using Server.Core.Common;

namespace Server.Infrastructure.Persistence.Entities;

public class Specialty : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public int SortOrder { get; set; }
}
