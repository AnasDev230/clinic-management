using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.LabTests.Repositories;

public class LabTestRepository : ILabTestRepository
{
    private readonly AppDbContext _dbContext;

    public LabTestRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<LabTest?> GetByIdAsync(Guid id)
        => WithDetails().AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);

    public Task<LabTest?> GetByIdForUpdateAsync(Guid id)
        => WithDetails().FirstOrDefaultAsync(t => t.Id == id);

    public Task<List<LabTest>> GetByVisitIdAsync(Guid visitId)
        => WithDetails()
            .AsNoTracking()
            .Where(t => t.VisitId == visitId)
            .OrderByDescending(t => t.OrderedDate)
            .ToListAsync();

    public async Task<(List<LabTest> Items, int TotalCount)> GetByPatientIdAsync(Guid patientId, int page, int pageSize)
    {
        var query = WithDetails()
            .AsNoTracking()
            .Where(t => t.PatientId == patientId);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(t => t.OrderedDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<(List<LabTest> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        LabTestStatus? status,
        string? category)
    {
        var query = WithDetails().AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(t =>
                t.TestName.ToLower().Contains(term) ||
                (t.Notes != null && t.Notes.ToLower().Contains(term)) ||
                (t.Patient != null && (t.Patient.FirstName.ToLower().Contains(term) ||
                    t.Patient.LastName.ToLower().Contains(term) ||
                    t.Patient.Phone.ToLower().Contains(term))));
        }

        if (doctorId.HasValue)
            query = query.Where(t => t.DoctorId == doctorId.Value || t.OrderedByDoctorId == doctorId.Value);

        if (patientId.HasValue)
            query = query.Where(t => t.PatientId == patientId.Value);

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        if (!string.IsNullOrWhiteSpace(category))
        {
            var normalized = category.Trim().ToLower();
            query = query.Where(t => t.TestCategory != null && t.TestCategory.ToLower() == normalized);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(t => t.OrderedDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task AddAsync(LabTest labTest)
    {
        await _dbContext.LabTests.AddAsync(labTest);
    }

    public void Update(LabTest labTest)
        => _dbContext.LabTests.Update(labTest);

    public void SoftDelete(LabTest labTest)
        => _dbContext.LabTests.Remove(labTest);

    private IQueryable<LabTest> WithDetails()
        => _dbContext.LabTests
            .Include(t => t.Patient)
            .Include(t => t.Doctor)
            .Include(t => t.OrderedByDoctor)
            .Include(t => t.PerformedByDoctor)
            .Include(t => t.Visit)
            .Include(t => t.Results.OrderBy(r => r.SortOrder));
}
