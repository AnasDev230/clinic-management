namespace Server.Features.Dashboard.Models;

public class RecentActivityResponse
{
    public List<RecentActivityItem> Activities { get; set; } = new();
}

public class RecentActivityItem
{
    public Guid Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public string EntityDisplayName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}
