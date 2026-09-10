using Server.Core.Common;
using Server.Features.Specialties.Models;

namespace Server.Features.Specialties.Services;

public interface ISpecialtyService
{
    Task<PagedResult<SpecialtyListItemResponse>> GetAllAsync(string? search, bool? isActive, int page, int pageSize);

    Task<SpecialtyResponse> GetByIdAsync(Guid id);

    Task<List<SpecialtyDropdownResponse>> GetDropdownAsync();

    Task<SpecialtyResponse> CreateAsync(CreateSpecialtyRequest request);

    Task<SpecialtyResponse> UpdateAsync(Guid id, UpdateSpecialtyRequest request);

    Task DeleteAsync(Guid id);
}
