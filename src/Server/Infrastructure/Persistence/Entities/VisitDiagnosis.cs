using Server.Core.Common;

namespace Server.Infrastructure.Persistence.Entities;

public class VisitDiagnosis : BaseEntity
{
    public Guid VisitId { get; set; }

    public string? Code { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsPrimary { get; set; } = false;

    public Visit? Visit { get; set; }
}
