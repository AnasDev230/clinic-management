using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Models;

public class PaymentListItemResponse
{
    public Guid Id { get; set; }

    public string PaymentNumber { get; set; } = string.Empty;

    public string PatientName { get; set; } = string.Empty;

    public string InvoiceNumber { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public PaymentMethod PaymentMethod { get; set; }

    public DateTime PaymentDate { get; set; }

    public PaymentStatus Status { get; set; }
}
