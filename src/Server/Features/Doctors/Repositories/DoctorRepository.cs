using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Doctors.Repositories;

public class DoctorRepository : IDoctorRepository
{
    private readonly AppDbContext _dbContext;

    public DoctorRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Doctor?> GetByIdAsync(Guid id)
        => WithDetails().AsNoTracking().FirstOrDefaultAsync(d => d.Id == id);

    public Task<Doctor?> GetByIdForUpdateAsync(Guid id)
        => WithDetails().FirstOrDefaultAsync(d => d.Id == id);

    public async Task<(List<Doctor> Items, int TotalCount)> GetAllAsync(int page, int pageSize, string? search, bool? isActive, Guid? specialtyId)
    {
        var query = _dbContext.Doctors
            .AsNoTracking()
            .Include(d => d.DoctorSpecialties)
                .ThenInclude(ds => ds.Specialty)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(d =>
                d.FirstName.ToLower().Contains(term) ||
                d.LastName.ToLower().Contains(term) ||
                d.Email.ToLower().Contains(term) ||
                d.Phone.ToLower().Contains(term) ||
                d.LicenseNumber.ToLower().Contains(term));
        }

        if (isActive.HasValue)
            query = query.Where(d => d.IsActive == isActive.Value);

        if (specialtyId.HasValue)
            query = query.Where(d => d.DoctorSpecialties.Any(ds => ds.SpecialtyId == specialtyId.Value));

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderBy(d => d.LastName)
            .ThenBy(d => d.FirstName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public Task<List<Doctor>> GetForDropdownAsync()
        => _dbContext.Doctors
            .AsNoTracking()
            .Where(d => d.IsActive)
            .OrderBy(d => d.LastName)
            .ThenBy(d => d.FirstName)
            .ToListAsync();

    public Task<Doctor?> GetByEmailAsync(string email)
    {
        var normalized = email.Trim().ToLower();
        return _dbContext.Doctors
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Email.ToLower() == normalized);
    }

    public Task<Doctor?> GetByLicenseAsync(string license)
    {
        var normalized = license.Trim().ToLower();
        return _dbContext.Doctors
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.LicenseNumber.ToLower() == normalized);
    }

    public Task<bool> ExistsByEmailAsync(string email, Guid? excludeId = null)
    {
        var normalized = email.Trim().ToLower();
        var query = _dbContext.Doctors.AsNoTracking().AsQueryable();

        if (excludeId.HasValue)
            query = query.Where(d => d.Id != excludeId.Value);

        return query.AnyAsync(d => d.Email.ToLower() == normalized);
    }

    public Task<bool> ExistsByLicenseAsync(string license, Guid? excludeId = null)
    {
        var normalized = license.Trim().ToLower();
        var query = _dbContext.Doctors.AsNoTracking().AsQueryable();

        if (excludeId.HasValue)
            query = query.Where(d => d.Id != excludeId.Value);

        return query.AnyAsync(d => d.LicenseNumber.ToLower() == normalized);
    }

    public async Task AddAsync(Doctor doctor)
    {
        await _dbContext.Doctors.AddAsync(doctor);
    }

    public void Update(Doctor doctor)
        => _dbContext.Doctors.Update(doctor);

    public void SoftDelete(Doctor doctor)
        => _dbContext.Doctors.Remove(doctor);

    private IQueryable<Doctor> WithDetails()
        => _dbContext.Doctors
            .Include(d => d.DoctorSpecialties)
                .ThenInclude(ds => ds.Specialty)
            .Include(d => d.DoctorSchedules);
}
