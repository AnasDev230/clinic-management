using Server.Features.Visits.Models;

namespace Server.Features.Visits.Services;

public interface IVisitDiagnosisService
{
    Task<List<DiagnosisResponse>> GetByVisitIdAsync(Guid visitId);

    Task<DiagnosisResponse> CreateAsync(Guid visitId, CreateDiagnosisRequest request);

    Task<DiagnosisResponse> UpdateAsync(Guid id, UpdateDiagnosisRequest request);

    Task DeleteAsync(Guid id);
}
