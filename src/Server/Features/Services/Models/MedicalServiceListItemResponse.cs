namespace Server.Features.Services.Models;

public class MedicalServiceListItemResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string CategoryName { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int DurationMinutes { get; set; }

    public bool IsActive { get; set; }
}
