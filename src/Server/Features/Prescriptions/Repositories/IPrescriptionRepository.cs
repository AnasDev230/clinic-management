using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Prescriptions.Repositories;

public interface IPrescriptionRepository
{
    Task<Prescription?> GetByIdAsync(Guid id);

    Task<Prescription?> GetByIdForUpdateAsync(Guid id);

    Task<List<Prescription>> GetByVisitIdAsync(Guid visitId);

    Task<(List<Prescription> Items, int TotalCount)> GetByPatientIdAsync(Guid patientId, int page, int pageSize);

    Task<(List<Prescription> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        PrescriptionStatus? status);

    Task AddAsync(Prescription prescription);

    void Update(Prescription prescription);

    void SoftDelete(Prescription prescription);
}
