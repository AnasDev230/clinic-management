using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Notifications.Models;

public class NotificationListItemResponse
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public NotificationType Type { get; set; }

    public NotificationPriority Priority { get; set; }

    public bool IsRead { get; set; }

    public DateTime CreatedAt { get; set; }
}
