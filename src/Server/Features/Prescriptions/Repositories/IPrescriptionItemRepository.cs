using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Prescriptions.Repositories;

public interface IPrescriptionItemRepository
{
    Task<List<PrescriptionItem>> GetByPrescriptionIdAsync(Guid prescriptionId);

    Task<PrescriptionItem?> GetByIdAsync(Guid id);

    Task<PrescriptionItem?> GetByIdForUpdateAsync(Guid id);

    Task AddRangeAsync(List<PrescriptionItem> items);

    void Update(PrescriptionItem item);

    void RemoveRange(List<PrescriptionItem> items);
}
