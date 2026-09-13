using Server.Core.Common;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Infrastructure.Persistence.Entities;

public class Payment : BaseEntity
{
    public string PaymentNumber { get; set; } = string.Empty;

    public Guid InvoiceId { get; set; }

    public Guid PatientId { get; set; }

    public decimal Amount { get; set; }

    public PaymentMethod PaymentMethod { get; set; }

    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

    public string? ReferenceNumber { get; set; }

    public string? Notes { get; set; }

    public Guid ReceivedBy { get; set; }

    public PaymentStatus Status { get; set; } = PaymentStatus.Completed;

    public Invoice? Invoice { get; set; }

    public Patient? Patient { get; set; }
}
