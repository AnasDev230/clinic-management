using Server.Core.Common;
using Server.Features.Notifications.Models;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Notifications.Services;

public interface INotificationService
{
    Task<PagedResult<NotificationListItemResponse>> GetByUserIdAsync(
        Guid userId,
        int page,
        int pageSize,
        bool? isRead);

    Task<int> GetUnreadCountAsync(Guid userId);

    Task<List<NotificationListItemResponse>> GetLatestAsync(Guid userId, int count);

    Task<NotificationResponse> MarkAsReadAsync(Guid notificationId);

    Task MarkAllAsReadAsync(Guid userId);

    Task DeleteAsync(Guid id);

    Task<Notification> CreateAsync(
        Guid userId,
        string title,
        string message,
        NotificationType type,
        NotificationPriority priority,
        string? actionUrl,
        string? relatedEntityType,
        Guid? relatedEntityId);

    Task CreateForRoleAsync(
        string role,
        string title,
        string message,
        NotificationType type,
        NotificationPriority priority,
        string? actionUrl);
}
