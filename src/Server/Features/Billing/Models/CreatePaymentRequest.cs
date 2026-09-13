using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Models;

public class CreatePaymentRequest
{
    public Guid InvoiceId { get; set; }

    public decimal Amount { get; set; }

    public PaymentMethod PaymentMethod { get; set; }

    public string? ReferenceNumber { get; set; }

    public string? Notes { get; set; }
}
