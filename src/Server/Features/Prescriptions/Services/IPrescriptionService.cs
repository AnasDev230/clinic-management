using Server.Core.Common;
using Server.Features.Prescriptions.Models;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Prescriptions.Services;

public interface IPrescriptionService
{
    Task<PrescriptionResponse> CreateAsync(CreatePrescriptionRequest request);

    Task<PrescriptionResponse> UpdateAsync(Guid id, UpdatePrescriptionRequest request);

    Task<PrescriptionResponse> GetByIdAsync(Guid id);

    Task<List<PrescriptionResponse>> GetByVisitIdAsync(Guid visitId);

    Task<PagedResult<PrescriptionListItemResponse>> GetByPatientIdAsync(Guid patientId, int page, int pageSize);

    Task<PagedResult<PrescriptionListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        PrescriptionStatus? status);

    Task<PrescriptionResponse> CompleteAsync(Guid id);

    Task<PrescriptionResponse> CancelAsync(Guid id);

    Task DeleteAsync(Guid id);
}
