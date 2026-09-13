using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.AuditLogs.Models;

public class AuditLogResponse
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public string? UserName { get; set; }

    public AuditAction Action { get; set; }

    public string EntityType { get; set; } = string.Empty;

    public Guid? EntityId { get; set; }

    public string? EntityDisplayName { get; set; }

    public string? Changes { get; set; }

    public object? ParsedChanges { get; set; }

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }

    public DateTime Timestamp { get; set; }

    public string? AdditionalInfo { get; set; }
}
