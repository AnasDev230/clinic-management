using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.LabTests.Repositories;

public interface ILabResultRepository
{
    Task<List<LabResult>> GetByLabTestIdAsync(Guid labTestId);

    Task<LabResult?> GetByIdAsync(Guid id);

    Task<LabResult?> GetByIdForUpdateAsync(Guid id);

    Task AddRangeAsync(List<LabResult> results);

    void Update(LabResult result);

    void RemoveRange(List<LabResult> results);
}
