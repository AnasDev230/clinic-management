using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.AuditLogs.Models;

public class AuditLogListItemResponse
{
    public Guid Id { get; set; }

    public string? UserName { get; set; }

    public AuditAction Action { get; set; }

    public string EntityType { get; set; } = string.Empty;

    public string? EntityDisplayName { get; set; }

    public DateTime Timestamp { get; set; }

    public string? IpAddress { get; set; }
}
