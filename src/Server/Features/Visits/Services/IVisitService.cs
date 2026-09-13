using Server.Core.Common;
using Server.Features.Visits.Models;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Visits.Services;

public interface IVisitService
{
    Task<VisitResponse> CreateAsync(CreateVisitRequest request);

    Task<VisitResponse> UpdateAsync(Guid id, UpdateVisitRequest request);

    Task<VisitResponse> StartConsultationAsync(Guid id);

    Task<VisitResponse> CompleteAsync(Guid id);

    Task<VisitResponse> GetByIdAsync(Guid id);

    Task<PagedResult<VisitListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        VisitStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo);

    Task<List<VisitListItemResponse>> GetTodayAsync();

    Task DeleteAsync(Guid id);
}
