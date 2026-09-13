namespace Server.Features.Billing.Models;

public class InvoiceItemResponse
{
    public Guid Id { get; set; }

    public Guid InvoiceId { get; set; }

    public string ServiceName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public Guid? MedicalServiceId { get; set; }

    public decimal Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal TotalAmount { get; set; }

    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
