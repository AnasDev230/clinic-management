using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Patients.Repositories;

public interface IPatientRepository
{
    Task<Patient?> GetByIdAsync(Guid id);

    /// <summary>
    /// Tracked load for update/delete flows (Phase 1 pattern).
    /// All other reads are AsNoTracking.
    /// </summary>
    Task<Patient?> GetByIdForUpdateAsync(Guid id);

    Task<(List<Patient> Items, int TotalCount)> GetAllAsync(int page, int pageSize, string? search, bool? isActive);

    Task<List<Patient>> GetForDropdownAsync();

    Task<Patient?> GetByPhoneAsync(string phone);

    Task<Patient?> GetByNationalIdAsync(string nationalId);

    Task<bool> ExistsByPhoneAsync(string phone, Guid? excludeId = null);

    Task AddAsync(Patient patient);

    void Update(Patient patient);

    void SoftDelete(Patient patient);
}
