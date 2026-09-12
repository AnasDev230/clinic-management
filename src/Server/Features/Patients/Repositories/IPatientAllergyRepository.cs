using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Patients.Repositories;

public interface IPatientAllergyRepository
{
    Task<List<PatientAllergy>> GetByPatientIdAsync(Guid patientId);

    Task<PatientAllergy?> GetByIdForUpdateAsync(Guid id);

    Task AddAsync(PatientAllergy entity);

    void Update(PatientAllergy entity);

    void SoftDelete(PatientAllergy entity);
}
