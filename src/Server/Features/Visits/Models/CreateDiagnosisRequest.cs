namespace Server.Features.Visits.Models;

public class CreateDiagnosisRequest
{
    public string? Code { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsPrimary { get; set; }
}
