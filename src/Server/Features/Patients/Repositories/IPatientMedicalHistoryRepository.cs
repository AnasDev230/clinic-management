using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Patients.Repositories;

public interface IPatientMedicalHistoryRepository
{
    Task<List<PatientMedicalHistory>> GetByPatientIdAsync(Guid patientId);

    Task<PatientMedicalHistory?> GetByIdForUpdateAsync(Guid id);

    Task AddAsync(PatientMedicalHistory entity);

    void Update(PatientMedicalHistory entity);

    void SoftDelete(PatientMedicalHistory entity);
}
