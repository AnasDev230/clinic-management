using Server.Core.Common;
using Server.Infrastructure.Identity;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Infrastructure.Persistence.Entities;

public class AuditLog : BaseEntity
{
    public Guid? UserId { get; set; }

    public string? UserName { get; set; }

    public AuditAction Action { get; set; }

    public string EntityType { get; set; } = string.Empty;

    public Guid? EntityId { get; set; }

    public string? EntityDisplayName { get; set; }

    public string? Changes { get; set; }

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public string? AdditionalInfo { get; set; }

    public ApplicationUser? User { get; set; }
}
