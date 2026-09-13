using Server.Features.Appointments.Models;

namespace Server.Features.Appointments.Services;

public interface IFollowUpService
{
    Task<List<FollowUpResponse>> GetByAppointmentIdAsync(Guid appointmentId);

    Task<FollowUpResponse> CreateAsync(Guid appointmentId, CreateFollowUpRequest request);

    Task<FollowUpResponse> UpdateAsync(Guid id, UpdateFollowUpRequest request);

    Task<FollowUpResponse> CompleteAsync(Guid id);

    Task DeleteAsync(Guid id);
}
