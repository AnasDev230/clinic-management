using Server.Core.Common;

namespace Server.Infrastructure.Persistence.Entities;

public class InvoiceItem : BaseEntity
{
    public Guid InvoiceId { get; set; }

    public string ServiceName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public Guid? MedicalServiceId { get; set; }

    public decimal Quantity { get; set; } = 1;

    public decimal UnitPrice { get; set; }

    public decimal DiscountAmount { get; set; }

    public decimal TotalAmount { get; set; }

    public int SortOrder { get; set; }

    public Invoice? Invoice { get; set; }

    public MedicalService? MedicalService { get; set; }
}
