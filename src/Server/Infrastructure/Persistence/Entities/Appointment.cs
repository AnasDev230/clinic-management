using Server.Core.Common;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Infrastructure.Persistence.Entities;

public class Appointment : BaseEntity
{
    public Guid PatientId { get; set; }

    public Guid DoctorId { get; set; }

    public DateTime AppointmentDate { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;

    public AppointmentType Type { get; set; } = AppointmentType.InPerson;

    public string? Reason { get; set; }

    public string? Notes { get; set; }

    public AppointmentPriority Priority { get; set; } = AppointmentPriority.Normal;

    public int DurationMinutes { get; set; } = 30;

    public DateTime? CancelledAt { get; set; }

    public string? CancellationReason { get; set; }

    public Guid? VisitId { get; set; }

    public Patient? Patient { get; set; }

    public Doctor? Doctor { get; set; }

    public Visit? Visit { get; set; }

    public ICollection<FollowUp> FollowUps { get; set; } = new List<FollowUp>();
}
