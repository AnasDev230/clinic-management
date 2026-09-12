using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Patients.Models;
using Server.Features.Patients.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Patients.Services;

public class PatientMedicalHistoryService : IPatientMedicalHistoryService
{
    private readonly IPatientMedicalHistoryRepository _repository;
    private readonly IPatientRepository _patientRepository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public PatientMedicalHistoryService(
        IPatientMedicalHistoryRepository repository,
        IPatientRepository patientRepository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _patientRepository = patientRepository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<List<MedicalHistoryResponse>> GetByPatientIdAsync(Guid patientId)
    {
        await EnsurePatientExistsAsync(patientId);

        var histories = await _repository.GetByPatientIdAsync(patientId);
        return histories.Select(MapToResponse).ToList();
    }

    public async Task<MedicalHistoryResponse> CreateAsync(Guid patientId, CreateMedicalHistoryRequest request)
    {
        await EnsurePatientExistsAsync(patientId);

        var history = new PatientMedicalHistory
        {
            PatientId = patientId,
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            DiagnosedDate = AsUtcNullable(request.DiagnosedDate),
            Status = request.Status,
            CreatedBy = _currentUserService.GetUserId()
        };

        await _repository.AddAsync(history);
        await _dbContext.SaveChangesAsync();

        return MapToResponse(history);
    }

    public async Task<MedicalHistoryResponse> UpdateAsync(Guid id, UpdateMedicalHistoryRequest request)
    {
        var history = await _repository.GetByIdForUpdateAsync(id);
        if (history is null)
            throw new NotFoundException("Medical history", id);

        history.Title = request.Title.Trim();
        history.Description = request.Description?.Trim();
        history.DiagnosedDate = AsUtcNullable(request.DiagnosedDate);
        history.Status = request.Status;
        history.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        return MapToResponse(history);
    }

    public async Task DeleteAsync(Guid id)
    {
        var history = await _repository.GetByIdForUpdateAsync(id);
        if (history is null)
            throw new NotFoundException("Medical history", id);

        _repository.SoftDelete(history);
        await _dbContext.SaveChangesAsync();
    }

    private async Task EnsurePatientExistsAsync(Guid patientId)
    {
        var patient = await _patientRepository.GetByIdAsync(patientId);
        if (patient is null)
            throw new NotFoundException("Patient", patientId);
    }

    private static DateTime? AsUtcNullable(DateTime? value)
        => value.HasValue
            ? (value.Value.Kind == DateTimeKind.Utc
                ? value.Value
                : DateTime.SpecifyKind(value.Value, DateTimeKind.Utc))
            : null;

    internal static MedicalHistoryResponse MapToResponse(PatientMedicalHistory history)
    {
        return new MedicalHistoryResponse
        {
            Id = history.Id,
            PatientId = history.PatientId,
            Title = history.Title,
            Description = history.Description,
            DiagnosedDate = history.DiagnosedDate,
            Status = history.Status
        };
    }
}
