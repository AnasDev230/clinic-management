using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Patients.Repositories;

public class PatientAllergyRepository : IPatientAllergyRepository
{
    private readonly AppDbContext _dbContext;

    public PatientAllergyRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<PatientAllergy>> GetByPatientIdAsync(Guid patientId)
        => _dbContext.PatientAllergies
            .AsNoTracking()
            .Where(a => a.PatientId == patientId)
            .OrderByDescending(a => a.Severity)
            .ThenBy(a => a.Name)
            .ToListAsync();

    public Task<PatientAllergy?> GetByIdForUpdateAsync(Guid id)
        => _dbContext.PatientAllergies.FirstOrDefaultAsync(a => a.Id == id);

    public async Task AddAsync(PatientAllergy entity)
    {
        await _dbContext.PatientAllergies.AddAsync(entity);
    }

    public void Update(PatientAllergy entity)
        => _dbContext.PatientAllergies.Update(entity);

    public void SoftDelete(PatientAllergy entity)
        => _dbContext.PatientAllergies.Remove(entity);
}
