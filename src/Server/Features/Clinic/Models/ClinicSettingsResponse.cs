namespace Server.Features.Clinic.Models;

public class ClinicSettingsResponse
{
    public Guid Id { get; set; }

    public string CurrencyCode { get; set; } = string.Empty;

    public string TimeZone { get; set; } = string.Empty;

    public bool AllowOnlineBooking { get; set; }

    public int AppointmentDurationMinutes { get; set; }

    public int MaxPatientsPerDay { get; set; }
}
