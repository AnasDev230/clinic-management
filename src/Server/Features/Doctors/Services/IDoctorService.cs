using Server.Core.Common;
using Server.Features.Doctors.Models;

namespace Server.Features.Doctors.Services;

public interface IDoctorService
{
    Task<DoctorResponse> CreateAsync(CreateDoctorRequest request);

    Task<DoctorResponse> UpdateAsync(Guid id, UpdateDoctorRequest request);

    Task<DoctorResponse> GetByIdAsync(Guid id);

    Task<PagedResult<DoctorListItemResponse>> GetAllAsync(int page, int pageSize, string? search, bool? isActive, Guid? specialtyId);

    Task<List<DoctorDropdownResponse>> GetForDropdownAsync();

    Task DeleteAsync(Guid id);
}
