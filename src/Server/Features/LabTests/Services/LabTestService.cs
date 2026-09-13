using Microsoft.EntityFrameworkCore;
using Server.Core.Common;
using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.LabTests.Models;
using Server.Features.LabTests.Repositories;
using Server.Features.Visits.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.LabTests.Services;

public class LabTestService : ILabTestService
{
    private readonly ILabTestRepository _repository;
    private readonly IVisitRepository _visitRepository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public LabTestService(
        ILabTestRepository repository,
        IVisitRepository visitRepository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _visitRepository = visitRepository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<LabTestResponse> CreateAsync(CreateLabTestRequest request)
    {
        var visit = await _visitRepository.GetByIdAsync(request.VisitId);
        if (visit is null)
            throw new NotFoundException("Visit", request.VisitId);

        var orderedByDoctorId = await ResolveCurrentDoctorIdAsync() ?? visit.DoctorId;

        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var labTest = new LabTest
            {
                VisitId = visit.Id,
                PatientId = visit.PatientId,
                DoctorId = visit.DoctorId,
                TestName = request.TestName.Trim(),
                TestCategory = request.TestCategory?.Trim(),
                OrderedDate = DateTime.UtcNow,
                Status = LabTestStatus.Ordered,
                Priority = request.Priority,
                Notes = request.Notes?.Trim(),
                OrderedByDoctorId = orderedByDoctorId,
                CreatedBy = _currentUserService.GetUserId()
            };

            await _repository.AddAsync(labTest);
            await _dbContext.SaveChangesAsync();

            if (request.Results is not null && request.Results.Count > 0)
            {
                var sortOrder = 0;
                foreach (var result in request.Results)
                {
                    _dbContext.LabResults.Add(new LabResult
                    {
                        LabTestId = labTest.Id,
                        ParameterName = result.ParameterName.Trim(),
                        Value = result.Value?.Trim(),
                        Unit = result.Unit?.Trim(),
                        NormalRange = result.NormalRange?.Trim(),
                        IsAbnormal = result.IsAbnormal,
                        Notes = result.Notes?.Trim(),
                        SortOrder = sortOrder++,
                        CreatedBy = _currentUserService.GetUserId()
                    });
                }

                await _dbContext.SaveChangesAsync();
            }

            await transaction.CommitAsync();

            var created = await _repository.GetByIdAsync(labTest.Id);
            return MapToResponse(created!);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<LabTestResponse> UpdateAsync(Guid id, UpdateLabTestRequest request)
    {
        var labTest = await _repository.GetByIdForUpdateAsync(id);
        if (labTest is null)
            throw new NotFoundException("LabTest", id);

        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            labTest.TestName = request.TestName.Trim();
            labTest.TestCategory = request.TestCategory?.Trim();
            labTest.Priority = request.Priority;
            labTest.Status = request.Status;
            labTest.Notes = request.Notes?.Trim();
            labTest.UpdatedBy = _currentUserService.GetUserId();

            SyncResults(labTest, request.Results);

            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            var updated = await _repository.GetByIdAsync(id);
            return MapToResponse(updated!);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<LabTestResponse> GetByIdAsync(Guid id)
    {
        var labTest = await _repository.GetByIdAsync(id);
        if (labTest is null)
            throw new NotFoundException("LabTest", id);

        return MapToResponse(labTest);
    }

    public async Task<List<LabTestResponse>> GetByVisitIdAsync(Guid visitId)
    {
        var items = await _repository.GetByVisitIdAsync(visitId);
        return items.Select(MapToResponse).ToList();
    }

    public async Task<PagedResult<LabTestListItemResponse>> GetByPatientIdAsync(Guid patientId, int page, int pageSize)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetByPatientIdAsync(patientId, page, pageSize);

        return new PagedResult<LabTestListItemResponse>
        {
            Items = items.Select(MapToListItem).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<PagedResult<LabTestListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        LabTestStatus? status,
        string? category)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetAllAsync(
            page, pageSize, search, doctorId, patientId, status, category);

        return new PagedResult<LabTestListItemResponse>
        {
            Items = items.Select(MapToListItem).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<LabTestResponse> StartAsync(Guid id)
    {
        var labTest = await _repository.GetByIdForUpdateAsync(id);
        if (labTest is null)
            throw new NotFoundException("LabTest", id);

        if (labTest.Status != LabTestStatus.Ordered)
            throw new BusinessException("Only ordered lab tests can be started.");

        labTest.Status = LabTestStatus.InProgress;
        labTest.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<LabTestResponse> CompleteAsync(Guid id, List<CreateLabResultRequest> results)
    {
        var labTest = await _repository.GetByIdForUpdateAsync(id);
        if (labTest is null)
            throw new NotFoundException("LabTest", id);

        if (labTest.Status != LabTestStatus.InProgress)
            throw new BusinessException("Only in-progress lab tests can be completed.");

        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            labTest.Status = LabTestStatus.Completed;
            labTest.PerformedByDoctorId = await ResolveCurrentDoctorIdAsync() ?? labTest.DoctorId;
            labTest.UpdatedBy = _currentUserService.GetUserId();

            var sortOrder = labTest.Results.Count > 0
                ? labTest.Results.Max(r => r.SortOrder) + 1
                : 0;

            foreach (var result in results)
            {
                _dbContext.LabResults.Add(new LabResult
                {
                    LabTestId = labTest.Id,
                    ParameterName = result.ParameterName.Trim(),
                    Value = result.Value?.Trim(),
                    Unit = result.Unit?.Trim(),
                    NormalRange = result.NormalRange?.Trim(),
                    IsAbnormal = result.IsAbnormal,
                    Notes = result.Notes?.Trim(),
                    SortOrder = sortOrder++,
                    CreatedBy = _currentUserService.GetUserId()
                });
            }

            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            var updated = await _repository.GetByIdAsync(id);
            return MapToResponse(updated!);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<LabTestResponse> CancelAsync(Guid id)
    {
        var labTest = await _repository.GetByIdForUpdateAsync(id);
        if (labTest is null)
            throw new NotFoundException("LabTest", id);

        if (labTest.Status != LabTestStatus.Ordered &&
            labTest.Status != LabTestStatus.InProgress)
            throw new BusinessException("Only ordered or in-progress lab tests can be cancelled.");

        labTest.Status = LabTestStatus.Cancelled;
        labTest.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task DeleteAsync(Guid id)
    {
        var labTest = await _repository.GetByIdForUpdateAsync(id);
        if (labTest is null)
            throw new NotFoundException("LabTest", id);

        _repository.SoftDelete(labTest);
        await _dbContext.SaveChangesAsync();
    }

    private async Task<Guid?> ResolveCurrentDoctorIdAsync()
    {
        var userId = _currentUserService.GetUserId();
        if (!userId.HasValue)
            return null;

        var doctorId = await _dbContext.Doctors
            .AsNoTracking()
            .Where(d => d.ApplicationUserId == userId.Value)
            .Select(d => (Guid?)d.Id)
            .FirstOrDefaultAsync();

        return doctorId;
    }

    private void SyncResults(LabTest labTest, List<UpdateLabResultRequest>? incoming)
    {
        if (incoming is null)
            return;

        var incomingIds = incoming
            .Where(r => r.Id.HasValue)
            .Select(r => r.Id!.Value)
            .ToHashSet();

        var toRemove = labTest.Results
            .Where(r => !incomingIds.Contains(r.Id))
            .ToList();

        if (toRemove.Count > 0)
            _dbContext.LabResults.RemoveRange(toRemove);

        var sortOrder = 0;
        foreach (var result in incoming)
        {
            if (result.Id.HasValue)
            {
                var existing = labTest.Results.FirstOrDefault(r => r.Id == result.Id.Value);
                if (existing is not null)
                {
                    existing.ParameterName = result.ParameterName.Trim();
                    existing.Value = result.Value?.Trim();
                    existing.Unit = result.Unit?.Trim();
                    existing.NormalRange = result.NormalRange?.Trim();
                    existing.IsAbnormal = result.IsAbnormal;
                    existing.Notes = result.Notes?.Trim();
                    existing.SortOrder = sortOrder++;
                    existing.UpdatedBy = _currentUserService.GetUserId();
                }
            }
            else
            {
                _dbContext.LabResults.Add(new LabResult
                {
                    LabTestId = labTest.Id,
                    ParameterName = result.ParameterName.Trim(),
                    Value = result.Value?.Trim(),
                    Unit = result.Unit?.Trim(),
                    NormalRange = result.NormalRange?.Trim(),
                    IsAbnormal = result.IsAbnormal,
                    Notes = result.Notes?.Trim(),
                    SortOrder = sortOrder++,
                    CreatedBy = _currentUserService.GetUserId()
                });
            }
        }
    }

    private static string BuildPatientName(LabTest labTest)
        => labTest.Patient is null
            ? string.Empty
            : $"{labTest.Patient.FirstName} {labTest.Patient.LastName}".Trim();

    private static string BuildDoctorName(LabTest labTest)
    {
        var doctor = labTest.OrderedByDoctor ?? labTest.Doctor;
        return doctor is null
            ? string.Empty
            : $"{doctor.FirstName} {doctor.LastName}".Trim();
    }

    private static LabTestListItemResponse MapToListItem(LabTest labTest)
        => new()
        {
            Id = labTest.Id,
            TestName = labTest.TestName,
            TestCategory = labTest.TestCategory,
            PatientName = BuildPatientName(labTest),
            OrderedDate = labTest.OrderedDate,
            Status = labTest.Status,
            Priority = labTest.Priority,
            ResultCount = labTest.Results.Count
        };

    private static LabTestResponse MapToResponse(LabTest labTest)
        => new()
        {
            Id = labTest.Id,
            VisitId = labTest.VisitId,
            PatientId = labTest.PatientId,
            PatientName = BuildPatientName(labTest),
            DoctorId = labTest.DoctorId,
            DoctorName = BuildDoctorName(labTest),
            OrderedByDoctorName = BuildDoctorName(labTest),
            TestName = labTest.TestName,
            TestCategory = labTest.TestCategory,
            OrderedDate = labTest.OrderedDate,
            Status = labTest.Status,
            Priority = labTest.Priority,
            Notes = labTest.Notes,
            Results = labTest.Results
                .OrderBy(r => r.SortOrder)
                .Select(r => new LabResultResponse
                {
                    Id = r.Id,
                    LabTestId = r.LabTestId,
                    ParameterName = r.ParameterName,
                    Value = r.Value,
                    Unit = r.Unit,
                    NormalRange = r.NormalRange,
                    IsAbnormal = r.IsAbnormal,
                    Notes = r.Notes,
                    SortOrder = r.SortOrder,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                }).ToList(),
            CreatedAt = labTest.CreatedAt,
            UpdatedAt = labTest.UpdatedAt
        };
}
