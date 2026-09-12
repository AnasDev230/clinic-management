using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Patients.Repositories;

public class PatientInsuranceRepository : IPatientInsuranceRepository
{
    private readonly AppDbContext _dbContext;

    public PatientInsuranceRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<PatientInsurance?> GetByPatientIdAsync(Guid patientId)
        => _dbContext.PatientInsurances
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.PatientId == patientId);

    public Task<PatientInsurance?> GetByIdForUpdateAsync(Guid id)
        => _dbContext.PatientInsurances.FirstOrDefaultAsync(i => i.Id == id);

    public async Task AddAsync(PatientInsurance entity)
    {
        await _dbContext.PatientInsurances.AddAsync(entity);
    }

    public void Update(PatientInsurance entity)
        => _dbContext.PatientInsurances.Update(entity);

    public void SoftDelete(PatientInsurance entity)
        => _dbContext.PatientInsurances.Remove(entity);
}
