namespace Server.Features.Billing.Models;

public class UpdateInvoiceRequest
{
    public DateTime? DueDate { get; set; }

    public decimal DiscountPercentage { get; set; }

    public decimal TaxPercentage { get; set; }

    public string? Notes { get; set; }

    public List<UpdateInvoiceItemRequest> Items { get; set; } = new();
}
