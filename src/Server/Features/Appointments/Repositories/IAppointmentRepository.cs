using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Appointments.Repositories;

public interface IAppointmentRepository
{
    Task<Appointment?> GetByIdAsync(Guid id);

    Task<Appointment?> GetByIdForUpdateAsync(Guid id);

    Task<(List<Appointment> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        AppointmentStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo);

    Task<List<Appointment>> GetByDoctorAndDateAsync(Guid doctorId, DateTime date);

    Task<List<Appointment>> GetTodayAppointmentsAsync();

    Task<bool> CheckConflictAsync(Guid doctorId, DateTime date, TimeSpan startTime, TimeSpan endTime, Guid? excludeId = null);

    Task AddAsync(Appointment appointment);

    void Update(Appointment appointment);

    void SoftDelete(Appointment appointment);
}
