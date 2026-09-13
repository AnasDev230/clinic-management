namespace Server.Features.Billing.Models;

public class CreateInvoiceRequest
{
    public Guid PatientId { get; set; }

    public Guid? VisitId { get; set; }

    public Guid? DoctorId { get; set; }

    public DateTime? DueDate { get; set; }

    public decimal DiscountPercentage { get; set; }

    public decimal TaxPercentage { get; set; }

    public string? Notes { get; set; }

    public List<CreateInvoiceItemRequest> Items { get; set; } = new();
}
