using Server.Core.Common;
using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Services.Models;
using Server.Features.Services.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Services.Services;

public class MedicalServiceService : IMedicalServiceService
{
    private readonly IMedicalServiceRepository _repository;
    private readonly IServiceCategoryRepository _categoryRepository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public MedicalServiceService(
        IMedicalServiceRepository repository,
        IServiceCategoryRepository categoryRepository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _categoryRepository = categoryRepository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<MedicalServiceResponse> CreateAsync(CreateMedicalServiceRequest request)
    {
        if (await _repository.ExistsByNameAsync(request.Name))
            throw new BusinessException("A service with the same name already exists.");

        var category = await _categoryRepository.GetByIdAsync(request.CategoryId);
        if (category is null)
            throw new NotFoundException("ServiceCategory", request.CategoryId);

        var service = new MedicalService
        {
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            CategoryId = request.CategoryId,
            Price = request.Price,
            DurationMinutes = request.DurationMinutes,
            RequiresAppointment = request.RequiresAppointment,
            SortOrder = request.SortOrder,
            IsActive = true,
            CreatedBy = _currentUserService.GetUserId()
        };

        await _repository.AddAsync(service);
        await _dbContext.SaveChangesAsync();

        var created = await _repository.GetByIdAsync(service.Id);
        return MapToResponse(created!);
    }

    public async Task<MedicalServiceResponse> UpdateAsync(Guid id, UpdateMedicalServiceRequest request)
    {
        var service = await _repository.GetByIdForUpdateAsync(id);
        if (service is null)
            throw new NotFoundException("MedicalService", id);

        if (!string.Equals(service.Name, request.Name.Trim(), StringComparison.OrdinalIgnoreCase) &&
            await _repository.ExistsByNameAsync(request.Name, id))
        {
            throw new BusinessException("A service with the same name already exists.");
        }

        var category = await _categoryRepository.GetByIdAsync(request.CategoryId);
        if (category is null)
            throw new NotFoundException("ServiceCategory", request.CategoryId);

        service.Name = request.Name.Trim();
        service.Description = request.Description?.Trim();
        service.CategoryId = request.CategoryId;
        service.Price = request.Price;
        service.DurationMinutes = request.DurationMinutes;
        service.RequiresAppointment = request.RequiresAppointment;
        service.SortOrder = request.SortOrder;
        service.IsActive = request.IsActive;
        service.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<MedicalServiceResponse> GetByIdAsync(Guid id)
    {
        var service = await _repository.GetByIdAsync(id);
        if (service is null)
            throw new NotFoundException("MedicalService", id);

        return MapToResponse(service);
    }

    public async Task<PagedResult<MedicalServiceListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? categoryId,
        bool? isActive)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetAllAsync(
            page, pageSize, search, categoryId, isActive);

        return new PagedResult<MedicalServiceListItemResponse>
        {
            Items = items.Select(s => new MedicalServiceListItemResponse
            {
                Id = s.Id,
                Name = s.Name,
                CategoryName = s.Category?.Name ?? string.Empty,
                Price = s.Price,
                DurationMinutes = s.DurationMinutes,
                IsActive = s.IsActive
            }).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<List<MedicalServiceDropdownResponse>> GetForDropdownAsync()
    {
        var items = await _repository.GetForDropdownAsync();

        return items.Select(s => new MedicalServiceDropdownResponse
        {
            Id = s.Id,
            Name = s.Name,
            Price = s.Price
        }).ToList();
    }

    public async Task DeleteAsync(Guid id)
    {
        var service = await _repository.GetByIdForUpdateAsync(id);
        if (service is null)
            throw new NotFoundException("MedicalService", id);

        _repository.SoftDelete(service);
        await _dbContext.SaveChangesAsync();
    }

    private static MedicalServiceResponse MapToResponse(MedicalService service)
        => new()
        {
            Id = service.Id,
            Name = service.Name,
            Description = service.Description,
            CategoryId = service.CategoryId,
            CategoryName = service.Category?.Name ?? string.Empty,
            Price = service.Price,
            DurationMinutes = service.DurationMinutes,
            IsActive = service.IsActive,
            RequiresAppointment = service.RequiresAppointment,
            SortOrder = service.SortOrder,
            CreatedAt = service.CreatedAt,
            UpdatedAt = service.UpdatedAt
        };
}
