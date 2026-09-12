namespace Server.Features.Doctors.Models;

public class DoctorScheduleItem
{
    public Guid Id { get; set; }

    public int DayOfWeek { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public bool IsActive { get; set; }
}
