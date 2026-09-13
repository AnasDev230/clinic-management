using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Models;

public class InvoiceResponse
{
    public Guid Id { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;

    public Guid PatientId { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public Guid? VisitId { get; set; }

    public DateTime? VisitDate { get; set; }

    public Guid? DoctorId { get; set; }

    public string DoctorName { get; set; } = string.Empty;

    public DateTime InvoiceDate { get; set; }

    public DateTime? DueDate { get; set; }

    public InvoiceStatus Status { get; set; }

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

    public List<InvoiceItemResponse> Items { get; set; } = new();

    public List<PaymentResponse> Payments { get; set; } = new();

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
