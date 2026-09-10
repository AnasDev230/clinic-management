namespace Server.Features.Clinic.Models;

public class UpdateClinicSettingsRequest
{
    public string CurrencyCode { get; set; } = string.Empty;

    public string TimeZone { get; set; } = string.Empty;

    public bool AllowOnlineBooking { get; set; } = true;

    public int AppointmentDurationMinutes { get; set; }

    public int MaxPatientsPerDay { get; set; }
}
