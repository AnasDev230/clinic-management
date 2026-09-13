using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Appointments.Repositories;

public interface IFollowUpRepository
{
    Task<List<FollowUp>> GetByAppointmentIdAsync(Guid appointmentId);

    Task<FollowUp?> GetByIdAsync(Guid id);

    Task<FollowUp?> GetByIdForUpdateAsync(Guid id);

    Task AddAsync(FollowUp followUp);

    void Update(FollowUp followUp);

    void SoftDelete(FollowUp followUp);
}
