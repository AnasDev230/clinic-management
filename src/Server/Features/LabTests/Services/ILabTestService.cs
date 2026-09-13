using Server.Core.Common;
using Server.Features.LabTests.Models;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.LabTests.Services;

public interface ILabTestService
{
    Task<LabTestResponse> CreateAsync(CreateLabTestRequest request);

    Task<LabTestResponse> UpdateAsync(Guid id, UpdateLabTestRequest request);

    Task<LabTestResponse> GetByIdAsync(Guid id);

    Task<List<LabTestResponse>> GetByVisitIdAsync(Guid visitId);

    Task<PagedResult<LabTestListItemResponse>> GetByPatientIdAsync(Guid patientId, int page, int pageSize);

    Task<PagedResult<LabTestListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        LabTestStatus? status,
        string? category);

    Task<LabTestResponse> StartAsync(Guid id);

    Task<LabTestResponse> CompleteAsync(Guid id, List<CreateLabResultRequest> results);

    Task<LabTestResponse> CancelAsync(Guid id);

    Task DeleteAsync(Guid id);
}
