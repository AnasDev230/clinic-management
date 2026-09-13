using Server.Core.Common;
using Server.Core.Services;
using Server.Features.AuditLogs.Models;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.AuditLogs.Services;

public interface IAuditLogService
{
    Task<PagedResult<AuditLogListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        Guid? userId,
        string? entityType,
        Guid? entityId,
        AuditAction? action,
        DateTime? dateFrom,
        DateTime? dateTo);

    Task<List<AuditLogResponse>> GetByEntityAsync(string entityType, Guid entityId);

    Task<AuditLogResponse> GetByIdAsync(Guid id);

    Task LogAsync(
        Guid? userId,
        string? userName,
        AuditAction action,
        string entityType,
        Guid? entityId,
        string? entityDisplayName,
        object? changes,
        string? ipAddress,
        string? userAgent);
}
