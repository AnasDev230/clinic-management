namespace Server.Features.LabTests.Models;

public class UpdateLabResultRequest
{
    public Guid? Id { get; set; }

    public string ParameterName { get; set; } = string.Empty;

    public string? Value { get; set; }

    public string? Unit { get; set; }

    public string? NormalRange { get; set; }

    public bool IsAbnormal { get; set; } = false;

    public string? Notes { get; set; }
}
