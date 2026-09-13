namespace Server.Features.Services.Models;

public class CreateMedicalServiceRequest
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public Guid CategoryId { get; set; }

    public decimal Price { get; set; }

    public int DurationMinutes { get; set; } = 30;

    public bool RequiresAppointment { get; set; } = true;

    public int SortOrder { get; set; } = 0;
}
