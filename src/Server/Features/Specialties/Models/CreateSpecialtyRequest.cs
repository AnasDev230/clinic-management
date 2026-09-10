namespace Server.Features.Specialties.Models;

public class CreateSpecialtyRequest
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public int SortOrder { get; set; }
}
