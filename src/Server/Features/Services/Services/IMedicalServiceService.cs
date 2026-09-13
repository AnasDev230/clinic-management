using Server.Core.Common;
using Server.Features.Services.Models;

namespace Server.Features.Services.Services;

public interface IMedicalServiceService
{
    Task<MedicalServiceResponse> CreateAsync(CreateMedicalServiceRequest request);

    Task<MedicalServiceResponse> UpdateAsync(Guid id, UpdateMedicalServiceRequest request);

    Task<MedicalServiceResponse> GetByIdAsync(Guid id);

    Task<PagedResult<MedicalServiceListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? categoryId,
        bool? isActive);

    Task<List<MedicalServiceDropdownResponse>> GetForDropdownAsync();

    Task DeleteAsync(Guid id);
}
