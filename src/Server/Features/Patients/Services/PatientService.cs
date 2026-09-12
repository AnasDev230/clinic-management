using Server.Core.Common;
using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Patients.Models;
using Server.Features.Patients.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Patients.Services;

public class PatientService : IPatientService
{
    private readonly IPatientRepository _repository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public PatientService(
        IPatientRepository repository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<PatientResponse> CreateAsync(CreatePatientRequest request)
    {
        if (await _repository.ExistsByPhoneAsync(request.Phone))
            throw new BusinessException("A patient with the same phone already exists.");

        var patient = new Patient
        {
            CreatedBy = _currentUserService.GetUserId()
        };
        MapToEntity(request, patient);

        await _repository.AddAsync(patient);
        await _dbContext.SaveChangesAsync();

        var created = await _repository.GetByIdAsync(patient.Id);
        return MapToResponse(created!);
    }

    public async Task<PatientResponse> UpdateAsync(Guid id, UpdatePatientRequest request)
    {
        var patient = await _repository.GetByIdForUpdateAsync(id);
        if (patient is null)
            throw new NotFoundException("Patient", id);

        if (!string.Equals(patient.Phone, request.Phone.Trim(), StringComparison.OrdinalIgnoreCase) &&
            await _repository.ExistsByPhoneAsync(request.Phone, id))
        {
            throw new BusinessException("A patient with the same phone already exists.");
        }

        MapToEntity(request, patient);
        patient.IsActive = request.IsActive;
        patient.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<PatientResponse> GetByIdAsync(Guid id)
    {
        var patient = await _repository.GetByIdAsync(id);
        if (patient is null)
            throw new NotFoundException("Patient", id);

        return MapToResponse(patient);
    }

    public async Task<PagedResult<PatientListItemResponse>> GetAllAsync(int page, int pageSize, string? search, bool? isActive)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetAllAsync(page, pageSize, search, isActive);

        return new PagedResult<PatientListItemResponse>
        {
            Items = items.Select(p => new PatientListItemResponse
            {
                Id = p.Id,
                FullName = BuildFullName(p.FirstName, p.LastName),
                DateOfBirth = p.DateOfBirth,
                Gender = p.Gender,
                Phone = p.Phone,
                IsActive = p.IsActive
            }).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<List<PatientDropdownResponse>> GetForDropdownAsync()
    {
        var patients = await _repository.GetForDropdownAsync();

        return patients.Select(p => new PatientDropdownResponse
        {
            Id = p.Id,
            FullName = BuildFullName(p.FirstName, p.LastName)
        }).ToList();
    }

    public async Task DeleteAsync(Guid id)
    {
        var patient = await _repository.GetByIdForUpdateAsync(id);
        if (patient is null)
            throw new NotFoundException("Patient", id);

        // Soft delete: SaveChangesAsync converts this to DeletedAt (see AppDbContext).
        _repository.SoftDelete(patient);
        await _dbContext.SaveChangesAsync();
    }

    private static void MapToEntity(CreatePatientRequest request, Patient entity)
    {
        entity.FirstName = request.FirstName.Trim();
        entity.LastName = request.LastName.Trim();
        entity.DateOfBirth = AsUtc(request.DateOfBirth);
        entity.Gender = request.Gender;
        entity.Phone = request.Phone.Trim();
        entity.Email = request.Email?.Trim();
        entity.Address = request.Address?.Trim();
        entity.City = request.City?.Trim();
        entity.NationalId = request.NationalId?.Trim();
        entity.BloodType = request.BloodType?.Trim();
        entity.EmergencyContactName = request.EmergencyContactName?.Trim();
        entity.EmergencyContactPhone = request.EmergencyContactPhone?.Trim();
        entity.Notes = request.Notes?.Trim();
    }

    private static void MapToEntity(UpdatePatientRequest request, Patient entity)
    {
        entity.FirstName = request.FirstName.Trim();
        entity.LastName = request.LastName.Trim();
        entity.DateOfBirth = AsUtc(request.DateOfBirth);
        entity.Gender = request.Gender;
        entity.Phone = request.Phone.Trim();
        entity.Email = request.Email?.Trim();
        entity.Address = request.Address?.Trim();
        entity.City = request.City?.Trim();
        entity.NationalId = request.NationalId?.Trim();
        entity.BloodType = request.BloodType?.Trim();
        entity.EmergencyContactName = request.EmergencyContactName?.Trim();
        entity.EmergencyContactPhone = request.EmergencyContactPhone?.Trim();
        entity.Notes = request.Notes?.Trim();
    }

    private static DateTime AsUtc(DateTime value)
        => value.Kind == DateTimeKind.Utc ? value : DateTime.SpecifyKind(value, DateTimeKind.Utc);

    private static string BuildFullName(string firstName, string lastName)
        => $"{firstName} {lastName}".Trim();

    internal static PatientResponse MapToResponse(Patient patient)
    {
        return new PatientResponse
        {
            Id = patient.Id,
            FirstName = patient.FirstName,
            LastName = patient.LastName,
            FullName = BuildFullName(patient.FirstName, patient.LastName),
            DateOfBirth = patient.DateOfBirth,
            Gender = patient.Gender,
            Phone = patient.Phone,
            Email = patient.Email,
            Address = patient.Address,
            City = patient.City,
            NationalId = patient.NationalId,
            BloodType = patient.BloodType,
            EmergencyContactName = patient.EmergencyContactName,
            EmergencyContactPhone = patient.EmergencyContactPhone,
            Notes = patient.Notes,
            IsActive = patient.IsActive,
            MedicalHistories = patient.MedicalHistories
                .Select(PatientMedicalHistoryService.MapToResponse).ToList(),
            Allergies = patient.Allergies
                .Select(PatientAllergyService.MapToResponse).ToList(),
            Insurance = patient.Insurance is null
                ? null
                : PatientInsuranceService.MapToResponse(patient.Insurance),
            CreatedAt = patient.CreatedAt,
            UpdatedAt = patient.UpdatedAt
        };
    }
}
