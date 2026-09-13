namespace Server.Features.Billing.Models;

public class UpdateInvoiceItemRequest
{
    public Guid? Id { get; set; }

    public string ServiceName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public Guid? MedicalServiceId { get; set; }

    public decimal Quantity { get; set; } = 1;

    public decimal UnitPrice { get; set; }

    public decimal DiscountAmount { get; set; }
}
