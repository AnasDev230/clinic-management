namespace Server.Features.Specialties.Models;

public class SpecialtyListItemResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsActive { get; set; }

    public int SortOrder { get; set; }
}
