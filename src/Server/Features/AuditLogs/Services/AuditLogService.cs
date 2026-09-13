using System.Text.Json;
using Server.Core.Common;
using Server.Core.Exceptions;
using Server.Core.Services;
using Server.Features.AuditLogs.Models;
using Server.Features.AuditLogs.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.AuditLogs.Services;

public class AuditLogService : IAuditLogService
{
    private readonly IAuditLogRepository _repository;
    private readonly AppDbContext _dbContext;

    public AuditLogService(IAuditLogRepository repository, AppDbContext dbContext)
    {
        _repository = repository;
        _dbContext = dbContext;
    }

    public async Task<PagedResult<AuditLogListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        Guid? userId,
        string? entityType,
        Guid? entityId,
        AuditAction? action,
        DateTime? dateFrom,
        DateTime? dateTo)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetAllAsync(
            page, pageSize, userId, entityType, entityId, action, dateFrom, dateTo);

        return new PagedResult<AuditLogListItemResponse>
        {
            Items = items.Select(MapToListItem).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<List<AuditLogResponse>> GetByEntityAsync(string entityType, Guid entityId)
    {
        var items = await _repository.GetByEntityAsync(entityType, entityId);
        return items.Select(MapToResponse).ToList();
    }

    public async Task<AuditLogResponse> GetByIdAsync(Guid id)
    {
        var auditLog = await _repository.GetByIdAsync(id);
        if (auditLog is null)
            throw new NotFoundException("AuditLog", id);

        return MapToResponse(auditLog);
    }

    public async Task LogAsync(
        Guid? userId,
        string? userName,
        AuditAction action,
        string entityType,
        Guid? entityId,
        string? entityDisplayName,
        object? changes,
        string? ipAddress,
        string? userAgent)
    {
        var auditLog = new AuditLog
        {
            UserId = userId,
            UserName = userName?.Trim(),
            Action = action,
            EntityType = entityType.Trim(),
            EntityId = entityId,
            EntityDisplayName = entityDisplayName?.Trim(),
            Changes = changes is null ? null : AuditLogHelper.SerializeChanges(changes),
            IpAddress = ipAddress?.Trim(),
            UserAgent = userAgent?.Trim(),
            Timestamp = DateTime.UtcNow
        };

        await _repository.AddAsync(auditLog);
        await _dbContext.SaveChangesAsync();
    }

    private static AuditLogListItemResponse MapToListItem(AuditLog auditLog)
        => new()
        {
            Id = auditLog.Id,
            UserName = auditLog.UserName,
            Action = auditLog.Action,
            EntityType = auditLog.EntityType,
            EntityDisplayName = auditLog.EntityDisplayName,
            Timestamp = auditLog.Timestamp,
            IpAddress = auditLog.IpAddress
        };

    private static AuditLogResponse MapToResponse(AuditLog auditLog)
        => new()
        {
            Id = auditLog.Id,
            UserId = auditLog.UserId,
            UserName = auditLog.UserName,
            Action = auditLog.Action,
            EntityType = auditLog.EntityType,
            EntityId = auditLog.EntityId,
            EntityDisplayName = auditLog.EntityDisplayName,
            Changes = auditLog.Changes,
            ParsedChanges = TryParseChanges(auditLog.Changes),
            IpAddress = auditLog.IpAddress,
            UserAgent = auditLog.UserAgent,
            Timestamp = auditLog.Timestamp,
            AdditionalInfo = auditLog.AdditionalInfo
        };

    private static object? TryParseChanges(string? changes)
    {
        if (string.IsNullOrWhiteSpace(changes))
            return null;

        try
        {
            return JsonSerializer.Deserialize<object>(changes);
        }
        catch (JsonException)
        {
            return null;
        }
    }
}
