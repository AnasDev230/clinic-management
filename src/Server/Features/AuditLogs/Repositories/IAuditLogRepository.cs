using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.AuditLogs.Repositories;

public interface IAuditLogRepository
{
    Task<AuditLog?> GetByIdAsync(Guid id);

    Task<(List<AuditLog> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        Guid? userId,
        string? entityType,
        Guid? entityId,
        AuditAction? action,
        DateTime? dateFrom,
        DateTime? dateTo);

    Task<List<AuditLog>> GetByEntityAsync(string entityType, Guid entityId);

    Task AddAsync(AuditLog auditLog);
}
