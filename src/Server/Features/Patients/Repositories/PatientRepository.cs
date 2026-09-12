using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Patients.Repositories;

public class PatientRepository : IPatientRepository
{
    private readonly AppDbContext _dbContext;

    public PatientRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Patient?> GetByIdAsync(Guid id)
        => WithDetails().AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

    public Task<Patient?> GetByIdForUpdateAsync(Guid id)
        => WithDetails().FirstOrDefaultAsync(p => p.Id == id);

    public async Task<(List<Patient> Items, int TotalCount)> GetAllAsync(int page, int pageSize, string? search, bool? isActive)
    {
        var query = _dbContext.Patients.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p =>
                p.FirstName.ToLower().Contains(term) ||
                p.LastName.ToLower().Contains(term) ||
                p.Phone.ToLower().Contains(term) ||
                (p.NationalId != null && p.NationalId.ToLower().Contains(term)));
        }

        if (isActive.HasValue)
            query = query.Where(p => p.IsActive == isActive.Value);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderBy(p => p.LastName)
            .ThenBy(p => p.FirstName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public Task<List<Patient>> GetForDropdownAsync()
        => _dbContext.Patients
            .AsNoTracking()
            .Where(p => p.IsActive)
            .OrderBy(p => p.LastName)
            .ThenBy(p => p.FirstName)
            .ToListAsync();

    public Task<Patient?> GetByPhoneAsync(string phone)
    {
        var normalized = phone.Trim().ToLower();
        return _dbContext.Patients
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Phone.ToLower() == normalized);
    }

    public Task<Patient?> GetByNationalIdAsync(string nationalId)
    {
        var normalized = nationalId.Trim().ToLower();
        return _dbContext.Patients
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.NationalId != null && p.NationalId.ToLower() == normalized);
    }

    public Task<bool> ExistsByPhoneAsync(string phone, Guid? excludeId = null)
    {
        var normalized = phone.Trim().ToLower();
        var query = _dbContext.Patients.AsNoTracking().AsQueryable();

        if (excludeId.HasValue)
            query = query.Where(p => p.Id != excludeId.Value);

        return query.AnyAsync(p => p.Phone.ToLower() == normalized);
    }

    public async Task AddAsync(Patient patient)
    {
        await _dbContext.Patients.AddAsync(patient);
    }

    public void Update(Patient patient)
        => _dbContext.Patients.Update(patient);

    public void SoftDelete(Patient patient)
        => _dbContext.Patients.Remove(patient);

    private IQueryable<Patient> WithDetails()
        => _dbContext.Patients
            .Include(p => p.MedicalHistories)
            .Include(p => p.Allergies)
            .Include(p => p.Insurance);
}
