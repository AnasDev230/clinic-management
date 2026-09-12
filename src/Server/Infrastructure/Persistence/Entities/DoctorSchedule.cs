using Server.Core.Common;

namespace Server.Infrastructure.Persistence.Entities;

public class DoctorSchedule : BaseEntity
{
    public Guid DoctorId { get; set; }

    /// <summary>0 = Sunday .. 6 = Saturday.</summary>
    public int DayOfWeek { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public bool IsActive { get; set; } = true;

    public Doctor? Doctor { get; set; }
}
