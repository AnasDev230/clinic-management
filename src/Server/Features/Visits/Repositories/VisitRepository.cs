using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Visits.Repositories;

public class VisitRepository : IVisitRepository
{
    private readonly AppDbContext _dbContext;

    public VisitRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Visit?> GetByIdAsync(Guid id)
        => WithDetails().AsNoTracking().FirstOrDefaultAsync(v => v.Id == id);

    public Task<Visit?> GetByIdForUpdateAsync(Guid id)
        => WithDetails().FirstOrDefaultAsync(v => v.Id == id);

    public Task<Visit?> GetByAppointmentIdAsync(Guid appointmentId)
        => WithDetails().AsNoTracking().FirstOrDefaultAsync(v => v.AppointmentId == appointmentId);

    public async Task<(List<Visit> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        VisitStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo)
    {
        var query = WithDetails().AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(v =>
                (v.ChiefComplaint != null && v.ChiefComplaint.ToLower().Contains(term)) ||
                (v.Diagnosis != null && v.Diagnosis.ToLower().Contains(term)) ||
                (v.Patient != null && (v.Patient.FirstName.ToLower().Contains(term) ||
                    v.Patient.LastName.ToLower().Contains(term) ||
                    v.Patient.Phone.ToLower().Contains(term))) ||
                (v.Doctor != null && (v.Doctor.FirstName.ToLower().Contains(term) ||
                    v.Doctor.LastName.ToLower().Contains(term))));
        }

        if (doctorId.HasValue)
            query = query.Where(v => v.DoctorId == doctorId.Value);

        if (patientId.HasValue)
            query = query.Where(v => v.PatientId == patientId.Value);

        if (status.HasValue)
            query = query.Where(v => v.Status == status.Value);

        if (dateFrom.HasValue)
            query = query.Where(v => v.VisitDate.Date >= dateFrom.Value.Date);

        if (dateTo.HasValue)
            query = query.Where(v => v.VisitDate.Date <= dateTo.Value.Date);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(v => v.VisitDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public Task<List<Visit>> GetTodayVisitsAsync()
        => WithDetails()
            .AsNoTracking()
            .Where(v => v.VisitDate.Date == DateTime.UtcNow.Date)
            .OrderBy(v => v.VisitDate)
            .ToListAsync();

    public async Task AddAsync(Visit visit)
    {
        await _dbContext.Visits.AddAsync(visit);
    }

    public void Update(Visit visit)
        => _dbContext.Visits.Update(visit);

    public void SoftDelete(Visit visit)
        => _dbContext.Visits.Remove(visit);

    private IQueryable<Visit> WithDetails()
        => _dbContext.Visits
            .Include(v => v.Patient)
            .Include(v => v.Doctor)
            .Include(v => v.Appointment)
            .Include(v => v.Diagnoses)
            .Include(v => v.Vitals);
}
