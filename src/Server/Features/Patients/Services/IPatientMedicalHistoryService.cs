using Server.Features.Patients.Models;

namespace Server.Features.Patients.Services;

public interface IPatientMedicalHistoryService
{
    Task<List<MedicalHistoryResponse>> GetByPatientIdAsync(Guid patientId);

    Task<MedicalHistoryResponse> CreateAsync(Guid patientId, CreateMedicalHistoryRequest request);

    Task<MedicalHistoryResponse> UpdateAsync(Guid id, UpdateMedicalHistoryRequest request);

    Task DeleteAsync(Guid id);
}
