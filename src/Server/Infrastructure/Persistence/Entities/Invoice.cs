using Server.Core.Common;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Infrastructure.Persistence.Entities;

public class Invoice : BaseEntity
{
    public string InvoiceNumber { get; set; } = string.Empty;

    public Guid PatientId { get; set; }

    public Guid? VisitId { get; set; }

    public Guid? DoctorId { get; set; }

    public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;

    public DateTime? DueDate { get; set; }

    public InvoiceStatus Status { get; set; } = InvoiceStatus.Draft;

    public decimal SubTotal { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal DiscountPercentage { get; set; }

    public decimal TaxAmount { get; set; }

    public decimal TaxPercentage { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal PaidAmount { get; set; }

    public decimal RemainingAmount { get; set; }

    public string? Notes { get; set; }

    public Guid IssuedBy { get; set; }

    public DateTime? IssuedAt { get; set; }

    public Patient? Patient { get; set; }

    public Visit? Visit { get; set; }

    public Doctor? Doctor { get; set; }

    public ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();

    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
