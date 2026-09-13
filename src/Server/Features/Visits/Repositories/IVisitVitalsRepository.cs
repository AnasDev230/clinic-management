using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Visits.Repositories;

public interface IVisitVitalsRepository
{
    Task<VisitVitals?> GetByVisitIdAsync(Guid visitId);

    Task<VisitVitals?> GetByVisitIdForUpdateAsync(Guid visitId);

    Task<VisitVitals?> GetByIdForUpdateAsync(Guid id);

    Task AddAsync(VisitVitals vitals);

    void Update(VisitVitals vitals);
}
