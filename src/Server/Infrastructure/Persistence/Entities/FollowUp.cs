using Server.Core.Common;

namespace Server.Infrastructure.Persistence.Entities;

public class FollowUp : BaseEntity
{
    public Guid AppointmentId { get; set; }

    public DateTime FollowUpDate { get; set; }

    public string? Notes { get; set; }

    public bool IsCompleted { get; set; } = false;

    public DateTime? CompletedAt { get; set; }

    public Appointment? Appointment { get; set; }
}
