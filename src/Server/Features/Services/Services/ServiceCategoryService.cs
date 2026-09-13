using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Services.Models;
using Server.Features.Services.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Services.Services;

public class ServiceCategoryService : IServiceCategoryService
{
    private readonly IServiceCategoryRepository _repository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public ServiceCategoryService(
        IServiceCategoryRepository repository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<ServiceCategoryResponse> CreateAsync(CreateServiceCategoryRequest request)
    {
        if (await _repository.ExistsByNameAsync(request.Name))
            throw new BusinessException("A category with the same name already exists.");

        var category = new ServiceCategory
        {
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            SortOrder = request.SortOrder,
            IsActive = true,
            CreatedBy = _currentUserService.GetUserId()
        };

        await _repository.AddAsync(category);
        await _dbContext.SaveChangesAsync();

        return MapToResponse(category);
    }

    public async Task<ServiceCategoryResponse> UpdateAsync(Guid id, UpdateServiceCategoryRequest request)
    {
        var category = await _repository.GetByIdForUpdateAsync(id);
        if (category is null)
            throw new NotFoundException("ServiceCategory", id);

        if (!string.Equals(category.Name, request.Name.Trim(), StringComparison.OrdinalIgnoreCase) &&
            await _repository.ExistsByNameAsync(request.Name, id))
        {
            throw new BusinessException("A category with the same name already exists.");
        }

        category.Name = request.Name.Trim();
        category.Description = request.Description?.Trim();
        category.SortOrder = request.SortOrder;
        category.IsActive = request.IsActive;
        category.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<ServiceCategoryResponse> GetByIdAsync(Guid id)
    {
        var category = await _repository.GetByIdAsync(id);
        if (category is null)
            throw new NotFoundException("ServiceCategory", id);

        return MapToResponse(category);
    }

    public async Task<List<ServiceCategoryListItemResponse>> GetAllAsync(bool? isActive)
    {
        var items = await _repository.GetAllAsync(isActive);

        return items.Select(c => new ServiceCategoryListItemResponse
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            ServiceCount = c.MedicalServices.Count,
            SortOrder = c.SortOrder,
            IsActive = c.IsActive
        }).ToList();
    }

    public async Task<List<ServiceCategoryDropdownResponse>> GetForDropdownAsync()
    {
        var items = await _repository.GetForDropdownAsync();

        return items.Select(c => new ServiceCategoryDropdownResponse
        {
            Id = c.Id,
            Name = c.Name
        }).ToList();
    }

    public async Task DeleteAsync(Guid id)
    {
        var category = await _repository.GetByIdForUpdateAsync(id);
        if (category is null)
            throw new NotFoundException("ServiceCategory", id);

        if (category.MedicalServices.Any(s => s.DeletedAt == null))
            throw new BusinessException("Cannot delete a category that has active services.");

        _repository.SoftDelete(category);
        await _dbContext.SaveChangesAsync();
    }

    private static ServiceCategoryResponse MapToResponse(ServiceCategory category)
        => new()
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            SortOrder = category.SortOrder,
            IsActive = category.IsActive,
            ServiceCount = category.MedicalServices.Count,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
}
