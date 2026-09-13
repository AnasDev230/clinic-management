using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Services.Repositories;

public class MedicalServiceRepository : IMedicalServiceRepository
{
    private readonly AppDbContext _dbContext;

    public MedicalServiceRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<MedicalService?> GetByIdAsync(Guid id)
        => WithDetails().AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);

    public Task<MedicalService?> GetByIdForUpdateAsync(Guid id)
        => WithDetails().FirstOrDefaultAsync(s => s.Id == id);

    public async Task<(List<MedicalService> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? categoryId,
        bool? isActive)
    {
        var query = WithDetails().AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(s =>
                s.Name.ToLower().Contains(term) ||
                (s.Description != null && s.Description.ToLower().Contains(term)));
        }

        if (categoryId.HasValue)
            query = query.Where(s => s.CategoryId == categoryId.Value);

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

    public Task<List<MedicalService>> GetForDropdownAsync()
        => WithDetails()
            .AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.SortOrder)
            .ThenBy(s => s.Name)
            .ToListAsync();

    public Task<List<MedicalService>> GetByCategoryIdAsync(Guid categoryId)
        => WithDetails()
            .AsNoTracking()
            .Where(s => s.CategoryId == categoryId)
            .OrderBy(s => s.SortOrder)
            .ThenBy(s => s.Name)
            .ToListAsync();

    public Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null)
    {
        var normalized = name.Trim().ToLower();
        var query = _dbContext.MedicalServices.AsNoTracking().AsQueryable();

        if (excludeId.HasValue)
            query = query.Where(s => s.Id != excludeId.Value);

        return query.AnyAsync(s => s.Name.ToLower() == normalized);
    }

    public async Task AddAsync(MedicalService service)
    {
        await _dbContext.MedicalServices.AddAsync(service);
    }

    public void Update(MedicalService service)
        => _dbContext.MedicalServices.Update(service);

    public void SoftDelete(MedicalService service)
        => _dbContext.MedicalServices.Remove(service);

    private IQueryable<MedicalService> WithDetails()
        => _dbContext.MedicalServices.Include(s => s.Category);
}
