using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Prescriptions.Repositories;

public class PrescriptionItemRepository : IPrescriptionItemRepository
{
    private readonly AppDbContext _dbContext;

    public PrescriptionItemRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<PrescriptionItem>> GetByPrescriptionIdAsync(Guid prescriptionId)
        => _dbContext.PrescriptionItems
            .AsNoTracking()
            .Where(i => i.PrescriptionId == prescriptionId)
            .OrderBy(i => i.SortOrder)
            .ToListAsync();

    public Task<PrescriptionItem?> GetByIdAsync(Guid id)
        => _dbContext.PrescriptionItems
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == id);

    public Task<PrescriptionItem?> GetByIdForUpdateAsync(Guid id)
        => _dbContext.PrescriptionItems
            .FirstOrDefaultAsync(i => i.Id == id);

    public async Task AddRangeAsync(List<PrescriptionItem> items)
    {
        await _dbContext.PrescriptionItems.AddRangeAsync(items);
    }

    public void Update(PrescriptionItem item)
        => _dbContext.PrescriptionItems.Update(item);

    public void RemoveRange(List<PrescriptionItem> items)
        => _dbContext.PrescriptionItems.RemoveRange(items);
}
