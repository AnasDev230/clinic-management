namespace Server.Features.Doctors.Models;

public class CreateScheduleRequest
{
    public int DayOfWeek { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }
}
