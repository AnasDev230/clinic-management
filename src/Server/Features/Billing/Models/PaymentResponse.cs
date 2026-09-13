using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Models;

public class PaymentResponse
{
    public Guid Id { get; set; }

    public string PaymentNumber { get; set; } = string.Empty;

    public Guid InvoiceId { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;

    public Guid PatientId { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public PaymentMethod PaymentMethod { get; set; }

    public DateTime PaymentDate { get; set; }

    public string? ReferenceNumber { get; set; }

    public string? Notes { get; set; }

    public Guid ReceivedBy { get; set; }

    public PaymentStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
