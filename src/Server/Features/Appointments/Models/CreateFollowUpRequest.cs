namespace Server.Features.Appointments.Models;

public class CreateFollowUpRequest
{
    public DateTime FollowUpDate { get; set; }

    public string? Notes { get; set; }
}
