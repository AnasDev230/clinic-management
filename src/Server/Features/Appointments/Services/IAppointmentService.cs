using Server.Core.Common;
using Server.Features.Appointments.Models;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Appointments.Services;

public interface IAppointmentService
{
    Task<AppointmentResponse> CreateAsync(CreateAppointmentRequest request);

    Task<AppointmentResponse> UpdateAsync(Guid id, UpdateAppointmentRequest request);

    Task<AppointmentResponse> CancelAsync(Guid id, CancelAppointmentRequest request);

    Task<AppointmentResponse> ConfirmAsync(Guid id);

    Task<AppointmentResponse> StartAsync(Guid id);

    Task<AppointmentResponse> CompleteAsync(Guid id);

    Task<AppointmentResponse> MarkNoShowAsync(Guid id);

    Task<AppointmentResponse> GetByIdAsync(Guid id);

    Task<PagedResult<AppointmentListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        AppointmentStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo);

    Task<List<AppointmentCalendarResponse>> GetTodayAsync();

    Task<List<AppointmentCalendarResponse>> GetByDoctorAndDateAsync(Guid doctorId, DateTime date);

    Task DeleteAsync(Guid id);
}
