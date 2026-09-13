using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Services.Repositories;

public interface IMedicalServiceRepository
{
    Task<MedicalService?> GetByIdAsync(Guid id);

    Task<MedicalService?> GetByIdForUpdateAsync(Guid id);

    Task<(List<MedicalService> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? categoryId,
        bool? isActive);

    Task<List<MedicalService>> GetForDropdownAsync();

    Task<List<MedicalService>> GetByCategoryIdAsync(Guid categoryId);

    Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null);

    Task AddAsync(MedicalService service);

    void Update(MedicalService service);

    void SoftDelete(MedicalService service);
}
