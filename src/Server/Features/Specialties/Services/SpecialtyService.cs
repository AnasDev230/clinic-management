using Server.Core.Common;
using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Specialties.Models;
using Server.Features.Specialties.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Specialties.Services;

public class SpecialtyService : ISpecialtyService
{
    private readonly ISpecialtyRepository _repository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public SpecialtyService(
        ISpecialtyRepository repository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<PagedResult<SpecialtyListItemResponse>> GetAllAsync(string? search, bool? isActive, int page, int pageSize)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetPagedAsync(search, isActive, page, pageSize);

        return new PagedResult<SpecialtyListItemResponse>
        {
            Items = items.Select(s => new SpecialtyListItemResponse
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                IsActive = s.IsActive,
                SortOrder = s.SortOrder
            }).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<SpecialtyResponse> GetByIdAsync(Guid id)
    {
        var specialty = await _repository.GetByIdReadOnlyAsync(id);
        if (specialty is null)
            throw new NotFoundException("Specialty", id);

        return MapToResponse(specialty);
    }

    public async Task<List<SpecialtyDropdownResponse>> GetDropdownAsync()
    {
        var specialties = await _repository.GetForDropdownAsync();

        return specialties.Select(s => new SpecialtyDropdownResponse
        {
            Id = s.Id,
            Name = s.Name
        }).ToList();
    }

    public async Task<SpecialtyResponse> CreateAsync(CreateSpecialtyRequest request)
    {
        if (await _repository.ExistsWithNameAsync(request.Name))
            throw new BusinessException("A specialty with the same name already exists.");

        var specialty = new Specialty
        {
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            IsActive = request.IsActive,
            SortOrder = request.SortOrder,
            CreatedBy = _currentUserService.GetUserId()
        };

        _repository.Add(specialty);
        await _dbContext.SaveChangesAsync();

        return MapToResponse(specialty);
    }

    public async Task<SpecialtyResponse> UpdateAsync(Guid id, UpdateSpecialtyRequest request)
    {
        var specialty = await _repository.GetByIdForUpdateAsync(id);
        if (specialty is null)
            throw new NotFoundException("Specialty", id);

        if (!string.Equals(specialty.Name, request.Name.Trim(), StringComparison.OrdinalIgnoreCase) &&
            await _repository.ExistsWithNameAsync(request.Name, id))
        {
            throw new BusinessException("A specialty with the same name already exists.");
        }

        specialty.Name = request.Name.Trim();
        specialty.Description = request.Description?.Trim();
        specialty.IsActive = request.IsActive;
        specialty.SortOrder = request.SortOrder;
        specialty.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        return MapToResponse(specialty);
    }

    public async Task DeleteAsync(Guid id)
    {
        var specialty = await _repository.GetByIdForUpdateAsync(id);
        if (specialty is null)
            throw new NotFoundException("Specialty", id);

        _repository.Remove(specialty);
        await _dbContext.SaveChangesAsync();
    }

    private static SpecialtyResponse MapToResponse(Specialty specialty)
    {
        return new SpecialtyResponse
        {
            Id = specialty.Id,
            Name = specialty.Name,
            Description = specialty.Description,
            IsActive = specialty.IsActive,
            SortOrder = specialty.SortOrder,
            CreatedAt = specialty.CreatedAt,
            UpdatedAt = specialty.UpdatedAt
        };
    }
}
