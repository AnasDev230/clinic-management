using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Patients.Models;
using Server.Features.Patients.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Patients.Services;

public class PatientInsuranceService : IPatientInsuranceService
{
    private readonly IPatientInsuranceRepository _repository;
    private readonly IPatientRepository _patientRepository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public PatientInsuranceService(
        IPatientInsuranceRepository repository,
        IPatientRepository patientRepository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _patientRepository = patientRepository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<InsuranceResponse?> GetByPatientIdAsync(Guid patientId)
    {
        await EnsurePatientExistsAsync(patientId);

        var insurance = await _repository.GetByPatientIdAsync(patientId);
        return insurance is null ? null : MapToResponse(insurance);
    }

    public async Task<InsuranceResponse> CreateOrUpdateAsync(Guid patientId, CreateInsuranceRequest request)
    {
        await EnsurePatientExistsAsync(patientId);

        var insurance = await _repository.GetByPatientIdAsync(patientId);
        if (insurance is null)
        {
            insurance = new PatientInsurance
            {
                PatientId = patientId,
                CreatedBy = _currentUserService.GetUserId()
            };
            MapToEntity(request, insurance);
            await _repository.AddAsync(insurance);
        }
        else
        {
            var tracked = await _repository.GetByIdForUpdateAsync(insurance.Id);
            if (tracked is null)
                throw new NotFoundException("Insurance", insurance.Id);

            insurance = tracked;
            MapToEntity(request, insurance);
            insurance.UpdatedBy = _currentUserService.GetUserId();
        }

        await _dbContext.SaveChangesAsync();

        return MapToResponse(insurance);
    }

    public async Task DeleteAsync(Guid patientId)
    {
        await EnsurePatientExistsAsync(patientId);

        var insurance = await _repository.GetByPatientIdAsync(patientId);
        if (insurance is null)
            throw new NotFoundException("Insurance for patient", patientId);

        var tracked = await _repository.GetByIdForUpdateAsync(insurance.Id);
        if (tracked is null)
            throw new NotFoundException("Insurance", insurance.Id);

        _repository.SoftDelete(tracked);
        await _dbContext.SaveChangesAsync();
    }

    private async Task EnsurePatientExistsAsync(Guid patientId)
    {
        var patient = await _patientRepository.GetByIdAsync(patientId);
        if (patient is null)
            throw new NotFoundException("Patient", patientId);
    }

    private static void MapToEntity(CreateInsuranceRequest request, PatientInsurance entity)
    {
        entity.ProviderName = request.ProviderName.Trim();
        entity.PolicyNumber = request.PolicyNumber.Trim();
        entity.GroupNumber = request.GroupNumber?.Trim();
        entity.ExpiryDate = AsUtc(request.ExpiryDate);
        entity.CoveragePercentage = request.CoveragePercentage;
        entity.IsActive = request.IsActive;
    }

    private static DateTime AsUtc(DateTime value)
        => value.Kind == DateTimeKind.Utc ? value : DateTime.SpecifyKind(value, DateTimeKind.Utc);

    internal static InsuranceResponse MapToResponse(PatientInsurance insurance)
    {
        return new InsuranceResponse
        {
            Id = insurance.Id,
            PatientId = insurance.PatientId,
            ProviderName = insurance.ProviderName,
            PolicyNumber = insurance.PolicyNumber,
            GroupNumber = insurance.GroupNumber,
            ExpiryDate = insurance.ExpiryDate,
            CoveragePercentage = insurance.CoveragePercentage,
            IsActive = insurance.IsActive
        };
    }
}
