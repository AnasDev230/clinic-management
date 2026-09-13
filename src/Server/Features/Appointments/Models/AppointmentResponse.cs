using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Appointments.Models;

public class AppointmentResponse
{
    public Guid Id { get; set; }

    public Guid PatientId { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public Guid DoctorId { get; set; }

    public string DoctorName { get; set; } = string.Empty;

    public DateTime AppointmentDate { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public AppointmentStatus Status { get; set; }

    public AppointmentType Type { get; set; }

    public string? Reason { get; set; }

    public string? Notes { get; set; }

    public AppointmentPriority Priority { get; set; }

    public int DurationMinutes { get; set; }

    public DateTime? CancelledAt { get; set; }

    public string? CancellationReason { get; set; }

    public Guid? VisitId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
