using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Services.Repositories;

public interface IServiceCategoryRepository
{
    Task<ServiceCategory?> GetByIdAsync(Guid id);

    Task<ServiceCategory?> GetByIdForUpdateAsync(Guid id);

    Task<List<ServiceCategory>> GetAllAsync(bool? isActive);

    Task<List<ServiceCategory>> GetForDropdownAsync();

    Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null);

    Task AddAsync(ServiceCategory category);

    void Update(ServiceCategory category);

    void SoftDelete(ServiceCategory category);
}
