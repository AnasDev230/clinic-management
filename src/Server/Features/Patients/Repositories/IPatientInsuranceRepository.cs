using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Patients.Repositories;

public interface IPatientInsuranceRepository
{
    Task<PatientInsurance?> GetByPatientIdAsync(Guid patientId);

    Task<PatientInsurance?> GetByIdForUpdateAsync(Guid id);

    Task AddAsync(PatientInsurance entity);

    void Update(PatientInsurance entity);

    void SoftDelete(PatientInsurance entity);
}
