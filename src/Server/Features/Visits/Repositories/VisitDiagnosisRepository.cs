using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Visits.Repositories;

public class VisitDiagnosisRepository : IVisitDiagnosisRepository
{
    private readonly AppDbContext _dbContext;

    public VisitDiagnosisRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<VisitDiagnosis>> GetByVisitIdAsync(Guid visitId)
        => _dbContext.VisitDiagnoses
            .AsNoTracking()
            .Where(d => d.VisitId == visitId)
            .OrderByDescending(d => d.IsPrimary)
            .ThenBy(d => d.Name)
            .ToListAsync();

    public Task<VisitDiagnosis?> GetByIdAsync(Guid id)
        => _dbContext.VisitDiagnoses
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id);

    public Task<VisitDiagnosis?> GetByIdForUpdateAsync(Guid id)
        => _dbContext.VisitDiagnoses
            .FirstOrDefaultAsync(d => d.Id == id);

    public async Task AddAsync(VisitDiagnosis diagnosis)
    {
        await _dbContext.VisitDiagnoses.AddAsync(diagnosis);
    }

    public void Update(VisitDiagnosis diagnosis)
        => _dbContext.VisitDiagnoses.Update(diagnosis);

    public void SoftDelete(VisitDiagnosis diagnosis)
        => _dbContext.VisitDiagnoses.Remove(diagnosis);
}
