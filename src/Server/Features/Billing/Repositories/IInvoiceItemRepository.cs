using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Billing.Repositories;

public interface IInvoiceItemRepository
{
    Task<List<InvoiceItem>> GetByInvoiceIdAsync(Guid invoiceId);

    Task AddRangeAsync(List<InvoiceItem> items);

    void Update(InvoiceItem item);

    void RemoveRange(List<InvoiceItem> items);
}
