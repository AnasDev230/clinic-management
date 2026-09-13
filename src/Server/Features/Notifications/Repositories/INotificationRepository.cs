using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Notifications.Repositories;

public interface INotificationRepository
{
    Task<Notification?> GetByIdAsync(Guid id);

    Task<Notification?> GetByIdForUpdateAsync(Guid id);

    Task<(List<Notification> Items, int TotalCount)> GetByUserIdAsync(
        Guid userId,
        int page,
        int pageSize,
        bool? isRead);

    Task<int> GetUnreadCountAsync(Guid userId);

    Task<List<Notification>> GetLatestAsync(Guid userId, int count);

    Task MarkAsReadAsync(Guid id);

    Task MarkAllAsReadAsync(Guid userId);

    Task AddAsync(Notification notification);

    void SoftDelete(Notification notification);

    Task<int> DeleteOlderThanAsync(DateTime before);
}
