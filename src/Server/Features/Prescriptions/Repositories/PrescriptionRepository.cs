using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Prescriptions.Repositories;

public class PrescriptionRepository : IPrescriptionRepository
{
    private readonly AppDbContext _dbContext;

    public PrescriptionRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Prescription?> GetByIdAsync(Guid id)
        => WithDetails().AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

    public Task<Prescription?> GetByIdForUpdateAsync(Guid id)
        => WithDetails().FirstOrDefaultAsync(p => p.Id == id);

    public Task<List<Prescription>> GetByVisitIdAsync(Guid visitId)
        => WithDetails()
            .AsNoTracking()
            .Where(p => p.VisitId == visitId)
            .OrderByDescending(p => p.PrescriptionDate)
            .ToListAsync();

    public async Task<(List<Prescription> Items, int TotalCount)> GetByPatientIdAsync(Guid patientId, int page, int pageSize)
    {
        var query = WithDetails()
            .AsNoTracking()
            .Where(p => p.PatientId == patientId);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(p => p.PrescriptionDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<(List<Prescription> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        PrescriptionStatus? status)
    {
        var query = WithDetails().AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p =>
                (p.Notes != null && p.Notes.ToLower().Contains(term)) ||
                p.Items.Any(i => i.MedicationName.ToLower().Contains(term)) ||
                (p.Patient != null && (p.Patient.FirstName.ToLower().Contains(term) ||
                    p.Patient.LastName.ToLower().Contains(term) ||
                    p.Patient.Phone.ToLower().Contains(term))) ||
                (p.Doctor != null && (p.Doctor.FirstName.ToLower().Contains(term) ||
                    p.Doctor.LastName.ToLower().Contains(term))));
        }

        if (doctorId.HasValue)
            query = query.Where(p => p.DoctorId == doctorId.Value);

        if (patientId.HasValue)
            query = query.Where(p => p.PatientId == patientId.Value);

        if (status.HasValue)
            query = query.Where(p => p.Status == status.Value);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(p => p.PrescriptionDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task AddAsync(Prescription prescription)
    {
        await _dbContext.Prescriptions.AddAsync(prescription);
    }

    public void Update(Prescription prescription)
        => _dbContext.Prescriptions.Update(prescription);

    public void SoftDelete(Prescription prescription)
        => _dbContext.Prescriptions.Remove(prescription);

    private IQueryable<Prescription> WithDetails()
        => _dbContext.Prescriptions
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .Include(p => p.Visit)
            .Include(p => p.Items.OrderBy(i => i.SortOrder));
}
