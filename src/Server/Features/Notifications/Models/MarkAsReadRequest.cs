namespace Server.Features.Notifications.Models;

public class MarkAsReadRequest
{
    public List<Guid> NotificationIds { get; set; } = new();
}
