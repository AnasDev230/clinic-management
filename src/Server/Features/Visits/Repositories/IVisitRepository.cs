using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Visits.Repositories;

public interface IVisitRepository
{
    Task<Visit?> GetByIdAsync(Guid id);

    Task<Visit?> GetByIdForUpdateAsync(Guid id);

    Task<Visit?> GetByAppointmentIdAsync(Guid appointmentId);

    Task<(List<Visit> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        VisitStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo);

    Task<List<Visit>> GetTodayVisitsAsync();

    Task AddAsync(Visit visit);

    void Update(Visit visit);

    void SoftDelete(Visit visit);
}
