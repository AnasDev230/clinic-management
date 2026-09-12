using Server.Features.Patients.Models;

namespace Server.Features.Patients.Services;

public interface IPatientAllergyService
{
    Task<List<AllergyResponse>> GetByPatientIdAsync(Guid patientId);

    Task<AllergyResponse> CreateAsync(Guid patientId, CreateAllergyRequest request);

    Task<AllergyResponse> UpdateAsync(Guid id, UpdateAllergyRequest request, Guid? patientId = null);

    Task DeleteAsync(Guid id, Guid? patientId = null);
}
