using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.LabTests.Repositories;

public class LabResultRepository : ILabResultRepository
{
    private readonly AppDbContext _dbContext;

    public LabResultRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<LabResult>> GetByLabTestIdAsync(Guid labTestId)
        => _dbContext.LabResults
            .AsNoTracking()
            .Where(r => r.LabTestId == labTestId)
            .OrderBy(r => r.SortOrder)
            .ToListAsync();

    public Task<LabResult?> GetByIdAsync(Guid id)
        => _dbContext.LabResults
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id);

    public Task<LabResult?> GetByIdForUpdateAsync(Guid id)
        => _dbContext.LabResults
            .FirstOrDefaultAsync(r => r.Id == id);

    public async Task AddRangeAsync(List<LabResult> results)
    {
        await _dbContext.LabResults.AddRangeAsync(results);
    }

    public void Update(LabResult result)
        => _dbContext.LabResults.Update(result);

    public void RemoveRange(List<LabResult> results)
        => _dbContext.LabResults.RemoveRange(results);
}
