using Server.Features.Services.Models;

namespace Server.Features.Services.Services;

public interface IServiceCategoryService
{
    Task<ServiceCategoryResponse> CreateAsync(CreateServiceCategoryRequest request);

    Task<ServiceCategoryResponse> UpdateAsync(Guid id, UpdateServiceCategoryRequest request);

    Task<ServiceCategoryResponse> GetByIdAsync(Guid id);

    Task<List<ServiceCategoryListItemResponse>> GetAllAsync(bool? isActive);

    Task<List<ServiceCategoryDropdownResponse>> GetForDropdownAsync();

    Task DeleteAsync(Guid id);
}
