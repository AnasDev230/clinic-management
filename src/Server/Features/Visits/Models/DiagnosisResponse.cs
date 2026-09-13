namespace Server.Features.Visits.Models;

public class DiagnosisResponse
{
    public Guid Id { get; set; }

    public Guid VisitId { get; set; }

    public string? Code { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsPrimary { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
