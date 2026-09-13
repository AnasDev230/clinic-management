using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Visits.Repositories;

public interface IVisitDiagnosisRepository
{
    Task<List<VisitDiagnosis>> GetByVisitIdAsync(Guid visitId);

    Task<VisitDiagnosis?> GetByIdAsync(Guid id);

    Task<VisitDiagnosis?> GetByIdForUpdateAsync(Guid id);

    Task AddAsync(VisitDiagnosis diagnosis);

    void Update(VisitDiagnosis diagnosis);

    void SoftDelete(VisitDiagnosis diagnosis);
}
