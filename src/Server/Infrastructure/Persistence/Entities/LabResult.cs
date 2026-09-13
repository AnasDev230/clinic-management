using Server.Core.Common;

namespace Server.Infrastructure.Persistence.Entities;

public class LabResult : BaseEntity
{
    public Guid LabTestId { get; set; }

    public string ParameterName { get; set; } = string.Empty;

    public string? Value { get; set; }

    public string? Unit { get; set; }

    public string? NormalRange { get; set; }

    public bool IsAbnormal { get; set; } = false;

    public string? Notes { get; set; }

    public int SortOrder { get; set; } = 0;

    public LabTest? LabTest { get; set; }
}
