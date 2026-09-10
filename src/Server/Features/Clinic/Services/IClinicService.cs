using Server.Features.Clinic.Models;

namespace Server.Features.Clinic.Services;

public interface IClinicService
{
    Task<ClinicProfileResponse> GetProfileAsync();

    Task<ClinicProfileResponse> UpdateProfileAsync(UpdateClinicProfileRequest request);

    Task<ClinicSettingsResponse> GetSettingsAsync();

    Task<ClinicSettingsResponse> UpdateSettingsAsync(UpdateClinicSettingsRequest request);
}
