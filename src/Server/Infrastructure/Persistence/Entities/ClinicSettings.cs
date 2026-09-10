using Server.Core.Common;

namespace Server.Infrastructure.Persistence.Entities;

public class ClinicSettings : BaseEntity
{
    public string CurrencyCode { get; set; } = "SYP";

    public string TimeZone { get; set; } = "Asia/Damascus";

    public bool AllowOnlineBooking { get; set; } = true;

    public int AppointmentDurationMinutes { get; set; } = 30;

    public int MaxPatientsPerDay { get; set; } = 50;
}
