using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Specialties.Repositories;

public interface ISpecialtyRepository
{
    Task<(List<Specialty> Items, int TotalCount)> GetPagedAsync(string? search, bool? isActive, int page, int pageSize);

    Task<Specialty?> GetByIdReadOnlyAsync(Guid id);

    Task<Specialty?> GetByIdForUpdateAsync(Guid id);

    Task<List<Specialty>> GetForDropdownAsync();

    Task<bool> ExistsWithNameAsync(string name, Guid? excludeId = null);

    void Add(Specialty specialty);

    void Remove(Specialty specialty);
}
