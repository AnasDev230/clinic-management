using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Doctors.Repositories;

public interface IDoctorRepository
{
    Task<Doctor?> GetByIdAsync(Guid id);

    /// <summary>
    /// Tracked load for update/delete flows (Phase 1 pattern).
    /// All other reads are AsNoTracking.
    /// </summary>
    Task<Doctor?> GetByIdForUpdateAsync(Guid id);

    Task<(List<Doctor> Items, int TotalCount)> GetAllAsync(int page, int pageSize, string? search, bool? isActive, Guid? specialtyId);

    Task<List<Doctor>> GetForDropdownAsync();

    Task<Doctor?> GetByEmailAsync(string email);

    Task<Doctor?> GetByLicenseAsync(string license);

    Task<bool> ExistsByEmailAsync(string email, Guid? excludeId = null);

    Task<bool> ExistsByLicenseAsync(string license, Guid? excludeId = null);

    Task AddAsync(Doctor doctor);

    void Update(Doctor doctor);

    void SoftDelete(Doctor doctor);
}
