using Server.Features.Visits.Models;

namespace Server.Features.Visits.Services;

public interface IVisitVitalsService
{
    Task<VitalsResponse?> GetByVisitIdAsync(Guid visitId);

    Task<VitalsResponse> CreateOrUpdateAsync(Guid visitId, CreateVitalsRequest request);
}
