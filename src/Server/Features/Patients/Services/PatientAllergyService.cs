using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Patients.Models;
using Server.Features.Patients.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Patients.Services;

public class PatientAllergyService : IPatientAllergyService
{
    private readonly IPatientAllergyRepository _repository;
    private readonly IPatientRepository _patientRepository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public PatientAllergyService(
        IPatientAllergyRepository repository,
        IPatientRepository patientRepository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _patientRepository = patientRepository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<List<AllergyResponse>> GetByPatientIdAsync(Guid patientId)
    {
        await EnsurePatientExistsAsync(patientId);

        var allergies = await _repository.GetByPatientIdAsync(patientId);
        return allergies.Select(MapToResponse).ToList();
    }

    public async Task<AllergyResponse> CreateAsync(Guid patientId, CreateAllergyRequest request)
    {
        await EnsurePatientExistsAsync(patientId);

        var allergy = new PatientAllergy
        {
            PatientId = patientId,
            Name = request.Name.Trim(),
            Type = request.Type,
            Severity = request.Severity,
            Notes = request.Notes?.Trim(),
            CreatedBy = _currentUserService.GetUserId()
        };

        await _repository.AddAsync(allergy);
        await _dbContext.SaveChangesAsync();

        return MapToResponse(allergy);
    }

    public async Task<AllergyResponse> UpdateAsync(Guid id, UpdateAllergyRequest request)
    {
        var allergy = await _repository.GetByIdForUpdateAsync(id);
        if (allergy is null)
            throw new NotFoundException("Allergy", id);

        allergy.Name = request.Name.Trim();
        allergy.Type = request.Type;
        allergy.Severity = request.Severity;
        allergy.Notes = request.Notes?.Trim();
        allergy.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        return MapToResponse(allergy);
    }

    public async Task DeleteAsync(Guid id)
    {
        var allergy = await _repository.GetByIdForUpdateAsync(id);
        if (allergy is null)
            throw new NotFoundException("Allergy", id);

        _repository.SoftDelete(allergy);
        await _dbContext.SaveChangesAsync();
    }

    private async Task EnsurePatientExistsAsync(Guid patientId)
    {
        var patient = await _patientRepository.GetByIdAsync(patientId);
        if (patient is null)
            throw new NotFoundException("Patient", patientId);
    }

    internal static AllergyResponse MapToResponse(PatientAllergy allergy)
    {
        return new AllergyResponse
        {
            Id = allergy.Id,
            PatientId = allergy.PatientId,
            Name = allergy.Name,
            Type = allergy.Type,
            Severity = allergy.Severity,
            Notes = allergy.Notes
        };
    }
}
