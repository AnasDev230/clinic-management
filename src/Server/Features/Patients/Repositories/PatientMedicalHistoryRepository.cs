using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Patients.Repositories;

public class PatientMedicalHistoryRepository : IPatientMedicalHistoryRepository
{
    private readonly AppDbContext _dbContext;

    public PatientMedicalHistoryRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<PatientMedicalHistory>> GetByPatientIdAsync(Guid patientId)
        => _dbContext.PatientMedicalHistories
            .AsNoTracking()
            .Where(h => h.PatientId == patientId)
            .OrderByDescending(h => h.DiagnosedDate)
            .ThenBy(h => h.Title)
            .ToListAsync();

    public Task<PatientMedicalHistory?> GetByIdForUpdateAsync(Guid id)
        => _dbContext.PatientMedicalHistories.FirstOrDefaultAsync(h => h.Id == id);

    public async Task AddAsync(PatientMedicalHistory entity)
    {
        await _dbContext.PatientMedicalHistories.AddAsync(entity);
    }

    public void Update(PatientMedicalHistory entity)
        => _dbContext.PatientMedicalHistories.Update(entity);

    public void SoftDelete(PatientMedicalHistory entity)
        => _dbContext.PatientMedicalHistories.Remove(entity);
}
