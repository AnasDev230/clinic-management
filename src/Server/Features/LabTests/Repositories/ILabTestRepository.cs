using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.LabTests.Repositories;

public interface ILabTestRepository
{
    Task<LabTest?> GetByIdAsync(Guid id);

    Task<LabTest?> GetByIdForUpdateAsync(Guid id);

    Task<List<LabTest>> GetByVisitIdAsync(Guid visitId);

    Task<(List<LabTest> Items, int TotalCount)> GetByPatientIdAsync(Guid patientId, int page, int pageSize);

    Task<(List<LabTest> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        LabTestStatus? status,
        string? category);

    Task AddAsync(LabTest labTest);

    void Update(LabTest labTest);

    void SoftDelete(LabTest labTest);
}
