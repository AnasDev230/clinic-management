namespace Server.Features.Patients.Models;

public class CreateInsuranceRequest
{
    public string ProviderName { get; set; } = string.Empty;

    public string PolicyNumber { get; set; } = string.Empty;

    public string? GroupNumber { get; set; }

    public DateTime ExpiryDate { get; set; }

    public decimal CoveragePercentage { get; set; }

    public bool IsActive { get; set; } = true;
}
