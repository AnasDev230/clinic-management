using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Visits.Models;
using Server.Features.Visits.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Visits.Services;

public class VisitDiagnosisService : IVisitDiagnosisService
{
    private readonly IVisitDiagnosisRepository _repository;
    private readonly IVisitRepository _visitRepository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public VisitDiagnosisService(
        IVisitDiagnosisRepository repository,
        IVisitRepository visitRepository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _visitRepository = visitRepository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<List<DiagnosisResponse>> GetByVisitIdAsync(Guid visitId)
    {
        var items = await _repository.GetByVisitIdAsync(visitId);
        return items.Select(MapToResponse).ToList();
    }

    public async Task<DiagnosisResponse> CreateAsync(Guid visitId, CreateDiagnosisRequest request)
    {
        var visit = await _visitRepository.GetByIdAsync(visitId);
        if (visit is null)
            throw new NotFoundException("Visit", visitId);

        var diagnosis = new VisitDiagnosis
        {
            VisitId = visitId,
            Code = request.Code?.Trim(),
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            IsPrimary = request.IsPrimary,
            CreatedBy = _currentUserService.GetUserId()
        };

        await _repository.AddAsync(diagnosis);
        await _dbContext.SaveChangesAsync();

        var created = await _repository.GetByIdAsync(diagnosis.Id);
        return MapToResponse(created!);
    }

    public async Task<DiagnosisResponse> UpdateAsync(Guid id, UpdateDiagnosisRequest request)
    {
        var diagnosis = await _repository.GetByIdForUpdateAsync(id);
        if (diagnosis is null)
            throw new NotFoundException("Diagnosis", id);

        diagnosis.Code = request.Code?.Trim();
        diagnosis.Name = request.Name.Trim();
        diagnosis.Description = request.Description?.Trim();
        diagnosis.IsPrimary = request.IsPrimary;
        diagnosis.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task DeleteAsync(Guid id)
    {
        var diagnosis = await _repository.GetByIdForUpdateAsync(id);
        if (diagnosis is null)
            throw new NotFoundException("Diagnosis", id);

        _repository.SoftDelete(diagnosis);
        await _dbContext.SaveChangesAsync();
    }

    private static DiagnosisResponse MapToResponse(VisitDiagnosis diagnosis)
    {
        return new DiagnosisResponse
        {
            Id = diagnosis.Id,
            VisitId = diagnosis.VisitId,
            Code = diagnosis.Code,
            Name = diagnosis.Name,
            Description = diagnosis.Description,
            IsPrimary = diagnosis.IsPrimary,
            CreatedAt = diagnosis.CreatedAt,
            UpdatedAt = diagnosis.UpdatedAt
        };
    }
}
