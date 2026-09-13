using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Notifications.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly AppDbContext _dbContext;

    public NotificationRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Notification?> GetByIdAsync(Guid id)
        => _dbContext.Notifications
            .AsNoTracking()
            .FirstOrDefaultAsync(n => n.Id == id);

    public Task<Notification?> GetByIdForUpdateAsync(Guid id)
        => _dbContext.Notifications
            .FirstOrDefaultAsync(n => n.Id == id);

    public async Task<(List<Notification> Items, int TotalCount)> GetByUserIdAsync(
        Guid userId,
        int page,
        int pageSize,
        bool? isRead)
    {
        var query = _dbContext.Notifications
            .AsNoTracking()
            .Where(n => n.UserId == userId);

        if (isRead.HasValue)
            query = query.Where(n => n.IsRead == isRead.Value);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(n => n.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public Task<int> GetUnreadCountAsync(Guid userId)
        => _dbContext.Notifications
            .AsNoTracking()
            .CountAsync(n => n.UserId == userId && !n.IsRead);

    public Task<List<Notification>> GetLatestAsync(Guid userId, int count)
        => _dbContext.Notifications
            .AsNoTracking()
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(count)
            .ToListAsync();

    public async Task MarkAsReadAsync(Guid id)
    {
        var notification = await _dbContext.Notifications
            .FirstOrDefaultAsync(n => n.Id == id);

        if (notification is null || notification.IsRead)
            return;

        notification.IsRead = true;
        notification.ReadAt = DateTime.UtcNow;
    }

    public async Task MarkAllAsReadAsync(Guid userId)
    {
        var unread = await _dbContext.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var notification in unread)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
        }
    }

    public async Task AddAsync(Notification notification)
    {
        await _dbContext.Notifications.AddAsync(notification);
    }

    public void SoftDelete(Notification notification)
        => _dbContext.Notifications.Remove(notification);

    public Task<int> DeleteOlderThanAsync(DateTime before)
        => _dbContext.Notifications
            .Where(n => n.CreatedAt < before)
            .ExecuteDeleteAsync();
}
