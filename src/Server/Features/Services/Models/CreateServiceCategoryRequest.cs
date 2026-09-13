namespace Server.Features.Services.Models;

public class CreateServiceCategoryRequest
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int SortOrder { get; set; } = 0;
}
