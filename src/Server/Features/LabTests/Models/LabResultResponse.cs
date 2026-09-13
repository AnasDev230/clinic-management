namespace Server.Features.LabTests.Models;

public class LabResultResponse
{
    public Guid Id { get; set; }

    public Guid LabTestId { get; set; }

    public string ParameterName { get; set; } = string.Empty;

    public string? Value { get; set; }

    public string? Unit { get; set; }

    public string? NormalRange { get; set; }

    public bool IsAbnormal { get; set; }

    public string? Notes { get; set; }

    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
