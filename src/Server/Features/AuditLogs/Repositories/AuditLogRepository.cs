using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.AuditLogs.Repositories;

public class AuditLogRepository : IAuditLogRepository
{
    private readonly AppDbContext _dbContext;

    public AuditLogRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<AuditLog?> GetByIdAsync(Guid id)
        => WithDetails().AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);

    public async Task<(List<AuditLog> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        Guid? userId,
        string? entityType,
        Guid? entityId,
        AuditAction? action,
        DateTime? dateFrom,
        DateTime? dateTo)
    {
        var query = WithDetails().AsNoTracking().AsQueryable();

        if (userId.HasValue)
            query = query.Where(a => a.UserId == userId.Value);

        if (!string.IsNullOrWhiteSpace(entityType))
            query = query.Where(a => a.EntityType == entityType);

        if (entityId.HasValue)
            query = query.Where(a => a.EntityId == entityId.Value);

        if (action.HasValue)
            query = query.Where(a => a.Action == action.Value);

        if (dateFrom.HasValue)
            query = query.Where(a => a.Timestamp >= dateFrom.Value.Date);

        if (dateTo.HasValue)
            query = query.Where(a => a.Timestamp < dateTo.Value.Date.AddDays(1));

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(a => a.Timestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public Task<List<AuditLog>> GetByEntityAsync(string entityType, Guid entityId)
        => WithDetails()
            .AsNoTracking()
            .Where(a => a.EntityType == entityType && a.EntityId == entityId)
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync();

    public async Task AddAsync(AuditLog auditLog)
    {
        await _dbContext.AuditLogs.AddAsync(auditLog);
    }

    private IQueryable<AuditLog> WithDetails()
        => _dbContext.AuditLogs
            .Include(a => a.User);
}
