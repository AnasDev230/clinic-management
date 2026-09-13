namespace Server.Features.Appointments.Models;

public class UpdateFollowUpRequest
{
    public DateTime FollowUpDate { get; set; }

    public string? Notes { get; set; }

    public bool IsCompleted { get; set; }
}
