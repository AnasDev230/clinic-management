using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Appointments.Models;

public class CreateAppointmentRequest
{
    public Guid PatientId { get; set; }

    public Guid DoctorId { get; set; }

    public DateTime AppointmentDate { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public AppointmentType Type { get; set; } = AppointmentType.InPerson;

    public string? Reason { get; set; }

    public string? Notes { get; set; }

    public AppointmentPriority Priority { get; set; } = AppointmentPriority.Normal;

    public int DurationMinutes { get; set; } = 30;
}
