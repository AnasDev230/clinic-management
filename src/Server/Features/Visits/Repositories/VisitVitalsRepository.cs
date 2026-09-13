using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Visits.Repositories;

public class VisitVitalsRepository : IVisitVitalsRepository
{
    private readonly AppDbContext _dbContext;

    public VisitVitalsRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<VisitVitals?> GetByVisitIdAsync(Guid visitId)
        => _dbContext.VisitVitals
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.VisitId == visitId);

    public Task<VisitVitals?> GetByVisitIdForUpdateAsync(Guid visitId)
        => _dbContext.VisitVitals
            .FirstOrDefaultAsync(v => v.VisitId == visitId);

    public Task<VisitVitals?> GetByIdForUpdateAsync(Guid id)
        => _dbContext.VisitVitals
            .FirstOrDefaultAsync(v => v.Id == id);

    public async Task AddAsync(VisitVitals vitals)
    {
        await _dbContext.VisitVitals.AddAsync(vitals);
    }

    public void Update(VisitVitals vitals)
        => _dbContext.VisitVitals.Update(vitals);
}
