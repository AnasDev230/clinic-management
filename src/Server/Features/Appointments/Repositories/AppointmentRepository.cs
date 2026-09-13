using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Appointments.Repositories;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly AppDbContext _dbContext;

    public AppointmentRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Appointment?> GetByIdAsync(Guid id)
        => WithDetails().AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);

    public Task<Appointment?> GetByIdForUpdateAsync(Guid id)
        => WithDetails().FirstOrDefaultAsync(a => a.Id == id);

    public async Task<(List<Appointment> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        AppointmentStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo)
    {
        var query = WithDetails().AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(a =>
                (a.Reason != null && a.Reason.ToLower().Contains(term)) ||
                (a.Notes != null && a.Notes.ToLower().Contains(term)) ||
                (a.Patient != null && (a.Patient.FirstName.ToLower().Contains(term) ||
                    a.Patient.LastName.ToLower().Contains(term) ||
                    a.Patient.Phone.ToLower().Contains(term))) ||
                (a.Doctor != null && (a.Doctor.FirstName.ToLower().Contains(term) ||
                    a.Doctor.LastName.ToLower().Contains(term))));
        }

        if (doctorId.HasValue)
            query = query.Where(a => a.DoctorId == doctorId.Value);

        if (patientId.HasValue)
            query = query.Where(a => a.PatientId == patientId.Value);

        if (status.HasValue)
            query = query.Where(a => a.Status == status.Value);

        if (dateFrom.HasValue)
            query = query.Where(a => a.AppointmentDate.Date >= dateFrom.Value.Date);

        if (dateTo.HasValue)
            query = query.Where(a => a.AppointmentDate.Date <= dateTo.Value.Date);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderBy(a => a.AppointmentDate)
            .ThenBy(a => a.StartTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public Task<List<Appointment>> GetByDoctorAndDateAsync(Guid doctorId, DateTime date)
        => WithDetails()
            .AsNoTracking()
            .Where(a => a.DoctorId == doctorId && a.AppointmentDate.Date == date.Date)
            .OrderBy(a => a.StartTime)
            .ToListAsync();

    public Task<List<Appointment>> GetTodayAppointmentsAsync()
        => WithDetails()
            .AsNoTracking()
            .Where(a => a.AppointmentDate.Date == DateTime.UtcNow.Date)
            .OrderBy(a => a.StartTime)
            .ToListAsync();

    public Task<bool> CheckConflictAsync(Guid doctorId, DateTime date, TimeSpan startTime, TimeSpan endTime, Guid? excludeId = null)
    {
        var query = _dbContext.Appointments.AsNoTracking().AsQueryable();

        query = query.Where(a =>
            a.DoctorId == doctorId &&
            a.AppointmentDate.Date == date.Date &&
            a.Status != AppointmentStatus.Cancelled &&
            a.Status != AppointmentStatus.NoShow &&
            a.StartTime < endTime &&
            a.EndTime > startTime);

        if (excludeId.HasValue)
            query = query.Where(a => a.Id != excludeId.Value);

        return query.AnyAsync();
    }

    public async Task AddAsync(Appointment appointment)
    {
        await _dbContext.Appointments.AddAsync(appointment);
    }

    public void Update(Appointment appointment)
        => _dbContext.Appointments.Update(appointment);

    public void SoftDelete(Appointment appointment)
        => _dbContext.Appointments.Remove(appointment);

    private IQueryable<Appointment> WithDetails()
        => _dbContext.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor);
}
