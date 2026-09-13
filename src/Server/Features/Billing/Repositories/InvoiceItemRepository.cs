using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Billing.Repositories;

public class InvoiceItemRepository : IInvoiceItemRepository
{
    private readonly AppDbContext _dbContext;

    public InvoiceItemRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<InvoiceItem>> GetByInvoiceIdAsync(Guid invoiceId)
        => _dbContext.InvoiceItems
            .AsNoTracking()
            .Where(i => i.InvoiceId == invoiceId)
            .OrderBy(i => i.SortOrder)
            .ToListAsync();

    public async Task AddRangeAsync(List<InvoiceItem> items)
    {
        await _dbContext.InvoiceItems.AddRangeAsync(items);
    }

    public void Update(InvoiceItem item)
        => _dbContext.InvoiceItems.Update(item);

    public void RemoveRange(List<InvoiceItem> items)
        => _dbContext.InvoiceItems.RemoveRange(items);
}
