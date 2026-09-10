using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Clinic.Repositories;

public interface IClinicRepository
{
    Task<ClinicProfile?> GetProfileReadOnlyAsync();

    Task<ClinicProfile?> GetProfileForUpdateAsync();

    Task<ClinicSettings?> GetSettingsReadOnlyAsync();

    Task<ClinicSettings?> GetSettingsForUpdateAsync();

    void AddProfile(ClinicProfile profile);

    void AddSettings(ClinicSettings settings);
}
