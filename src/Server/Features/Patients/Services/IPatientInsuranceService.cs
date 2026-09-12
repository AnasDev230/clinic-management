using Server.Features.Patients.Models;

namespace Server.Features.Patients.Services;

public interface IPatientInsuranceService
{
    Task<InsuranceResponse?> GetByPatientIdAsync(Guid patientId);

    Task<InsuranceResponse> CreateOrUpdateAsync(Guid patientId, CreateInsuranceRequest request);

    Task DeleteAsync(Guid patientId);
}
