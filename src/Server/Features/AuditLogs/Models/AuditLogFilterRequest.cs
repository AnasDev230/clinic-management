using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.AuditLogs.Models;

public class AuditLogFilterRequest
{
    public Guid? UserId { get; set; }

    public string? EntityType { get; set; }

    public Guid? EntityId { get; set; }

    public AuditAction? Action { get; set; }

    public DateTime? DateFrom { get; set; }

    public DateTime? DateTo { get; set; }
}
