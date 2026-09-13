using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Models;

public class InvoiceListItemResponse
{
    public Guid Id { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;

    public string PatientName { get; set; } = string.Empty;

    public DateTime InvoiceDate { get; set; }

    public DateTime? DueDate { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal PaidAmount { get; set; }

    public decimal RemainingAmount { get; set; }

    public InvoiceStatus Status { get; set; }
}
