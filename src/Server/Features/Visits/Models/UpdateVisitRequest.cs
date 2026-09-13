namespace Server.Features.Visits.Models;

public class UpdateVisitRequest
{
    public string? ChiefComplaint { get; set; }

    public string? Symptoms { get; set; }

    public string? Diagnosis { get; set; }

    public string? TreatmentPlan { get; set; }

    public string? Notes { get; set; }

    public bool NextVisitRecommended { get; set; }

    public string? NextVisitNotes { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal DiscountAmount { get; set; }
}
