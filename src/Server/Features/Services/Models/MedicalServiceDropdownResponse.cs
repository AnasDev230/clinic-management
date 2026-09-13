namespace Server.Features.Services.Models;

public class MedicalServiceDropdownResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Price { get; set; }
}
