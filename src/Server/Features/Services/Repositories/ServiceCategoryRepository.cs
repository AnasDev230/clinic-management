using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Services.Repositories;

public class ServiceCategoryRepository : IServiceCategoryRepository
{
    private readonly AppDbContext _dbContext;

    public ServiceCategoryRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<ServiceCategory?> GetByIdAsync(Guid id)
        => _dbContext.ServiceCategories
            .AsNoTracking()
            .Include(c => c.MedicalServices)
            .FirstOrDefaultAsync(c => c.Id == id);

    public Task<ServiceCategory?> GetByIdForUpdateAsync(Guid id)
        => _dbContext.ServiceCategories
            .Include(c => c.MedicalServices)
            .FirstOrDefaultAsync(c => c.Id == id);

    public Task<List<ServiceCategory>> GetAllAsync(bool? isActive)
    {
        var query = _dbContext.ServiceCategories
            .AsNoTracking()
            .Include(c => c.MedicalServices)
            .AsQueryable();

        if (isActive.HasValue)
            query = query.Where(c => c.IsActive == isActive.Value);

        return query
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();
    }

    public Task<List<ServiceCategory>> GetForDropdownAsync()
        => _dbContext.ServiceCategories
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();

    public Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null)
    {
        var normalized = name.Trim().ToLower();
        var query = _dbContext.ServiceCategories.AsNoTracking().AsQueryable();

        if (excludeId.HasValue)
            query = query.Where(c => c.Id != excludeId.Value);

        return query.AnyAsync(c => c.Name.ToLower() == normalized);
    }

    public async Task AddAsync(ServiceCategory category)
    {
        await _dbContext.ServiceCategories.AddAsync(category);
    }

    public void Update(ServiceCategory category)
        => _dbContext.ServiceCategories.Update(category);

    public void SoftDelete(ServiceCategory category)
        => _dbContext.ServiceCategories.Remove(category);
}
