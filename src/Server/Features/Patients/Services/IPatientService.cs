using Server.Core.Common;
using Server.Features.Patients.Models;

namespace Server.Features.Patients.Services;

public interface IPatientService
{
    Task<PatientResponse> CreateAsync(CreatePatientRequest request);

    Task<PatientResponse> UpdateAsync(Guid id, UpdatePatientRequest request);

    Task<PatientResponse> GetByIdAsync(Guid id);

    Task<PagedResult<PatientListItemResponse>> GetAllAsync(int page, int pageSize, string? search, bool? isActive);

    Task<List<PatientDropdownResponse>> GetForDropdownAsync();

    Task DeleteAsync(Guid id);
}
