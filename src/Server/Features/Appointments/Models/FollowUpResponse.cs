namespace Server.Features.Appointments.Models;

public class FollowUpResponse
{
    public Guid Id { get; set; }

    public Guid AppointmentId { get; set; }

    public DateTime FollowUpDate { get; set; }

    public string? Notes { get; set; }

    public bool IsCompleted { get; set; }

    public DateTime? CompletedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
