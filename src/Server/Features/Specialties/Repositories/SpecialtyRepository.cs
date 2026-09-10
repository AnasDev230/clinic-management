using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Specialties.Repositories;

public class SpecialtyRepository : ISpecialtyRepository
{
    private readonly AppDbContext _dbContext;

    public SpecialtyRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(List<Specialty> Items, int TotalCount)> GetPagedAsync(string? search, bool? isActive, int page, int pageSize)
    {
        var query = _dbContext.Specialties.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(s =>
                s.Name.ToLower().Contains(term) ||
                (s.Description != null && s.Description.ToLower().Contains(term)));
        }

        if (isActive.HasValue)
            query = query.Where(s => s.IsActive == isActive.Value);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderBy(s => s.SortOrder)
            .ThenBy(s => s.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public Task<Specialty?> GetByIdReadOnlyAsync(Guid id)
        => _dbContext.Specialties.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);

    public Task<Specialty?> GetByIdForUpdateAsync(Guid id)
        => _dbContext.Specialties.FirstOrDefaultAsync(s => s.Id == id);

    public Task<List<Specialty>> GetForDropdownAsync()
        => _dbContext.Specialties.AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.SortOrder)
            .ThenBy(s => s.Name)
            .ToListAsync();

    public Task<bool> ExistsWithNameAsync(string name, Guid? excludeId = null)
    {
        var normalized = name.Trim().ToLower();
        var query = _dbContext.Specialties.AsNoTracking().AsQueryable();

        if (excludeId.HasValue)
            query = query.Where(s => s.Id != excludeId.Value);

        return query.AnyAsync(s => s.Name.ToLower() == normalized);
    }

    public void Add(Specialty specialty)
        => _dbContext.Specialties.Add(specialty);

    public void Remove(Specialty specialty)
        => _dbContext.Specialties.Remove(specialty);
}
