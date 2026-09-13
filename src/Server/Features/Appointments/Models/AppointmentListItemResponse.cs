using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Appointments.Models;

public class AppointmentListItemResponse
{
    public Guid Id { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public string DoctorName { get; set; } = string.Empty;

    public DateTime AppointmentDate { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public AppointmentStatus Status { get; set; }

    public AppointmentType Type { get; set; }

    public AppointmentPriority Priority { get; set; }
}
