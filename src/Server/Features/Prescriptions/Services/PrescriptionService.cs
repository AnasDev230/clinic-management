using Server.Core.Common;
using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Prescriptions.Models;
using Server.Features.Prescriptions.Repositories;
using Server.Features.Visits.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Prescriptions.Services;

public class PrescriptionService : IPrescriptionService
{
    private readonly IPrescriptionRepository _repository;
    private readonly IVisitRepository _visitRepository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public PrescriptionService(
        IPrescriptionRepository repository,
        IVisitRepository visitRepository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _visitRepository = visitRepository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<PrescriptionResponse> CreateAsync(CreatePrescriptionRequest request)
    {
        var visit = await _visitRepository.GetByIdAsync(request.VisitId);
        if (visit is null)
            throw new NotFoundException("Visit", request.VisitId);

        if (visit.Status != VisitStatus.Completed)
            throw new BusinessException("A prescription can only be created for a completed visit.");

        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var prescription = new Prescription
            {
                VisitId = visit.Id,
                PatientId = visit.PatientId,
                DoctorId = visit.DoctorId,
                PrescriptionDate = DateTime.UtcNow,
                Notes = request.Notes?.Trim(),
                Status = PrescriptionStatus.Active,
                ValidUntil = request.ValidUntil,
                CreatedBy = _currentUserService.GetUserId()
            };

            await _repository.AddAsync(prescription);
            await _dbContext.SaveChangesAsync();

            var sortOrder = 0;
            foreach (var item in request.Items)
            {
                _dbContext.PrescriptionItems.Add(new PrescriptionItem
                {
                    PrescriptionId = prescription.Id,
                    MedicationName = item.MedicationName.Trim(),
                    Dosage = item.Dosage?.Trim(),
                    Frequency = item.Frequency?.Trim(),
                    Duration = item.Duration?.Trim(),
                    Quantity = item.Quantity,
                    Instructions = item.Instructions?.Trim(),
                    SortOrder = sortOrder++,
                    CreatedBy = _currentUserService.GetUserId()
                });
            }

            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            var created = await _repository.GetByIdAsync(prescription.Id);
            return MapToResponse(created!);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<PrescriptionResponse> UpdateAsync(Guid id, UpdatePrescriptionRequest request)
    {
        var prescription = await _repository.GetByIdForUpdateAsync(id);
        if (prescription is null)
            throw new NotFoundException("Prescription", id);

        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            prescription.Notes = request.Notes?.Trim();
            prescription.ValidUntil = request.ValidUntil;
            prescription.Status = request.Status;
            prescription.UpdatedBy = _currentUserService.GetUserId();

            var incomingIds = request.Items
                .Where(i => i.Id.HasValue)
                .Select(i => i.Id!.Value)
                .ToHashSet();

            var toRemove = prescription.Items
                .Where(i => !incomingIds.Contains(i.Id))
                .ToList();

            if (toRemove.Count > 0)
                _dbContext.PrescriptionItems.RemoveRange(toRemove);

            var sortOrder = 0;
            foreach (var item in request.Items)
            {
                if (item.Id.HasValue)
                {
                    var existing = prescription.Items.FirstOrDefault(i => i.Id == item.Id.Value);
                    if (existing is not null)
                    {
                        existing.MedicationName = item.MedicationName.Trim();
                        existing.Dosage = item.Dosage?.Trim();
                        existing.Frequency = item.Frequency?.Trim();
                        existing.Duration = item.Duration?.Trim();
                        existing.Quantity = item.Quantity;
                        existing.Instructions = item.Instructions?.Trim();
                        existing.SortOrder = sortOrder++;
                        existing.UpdatedBy = _currentUserService.GetUserId();
                    }
                }
                else
                {
                    _dbContext.PrescriptionItems.Add(new PrescriptionItem
                    {
                        PrescriptionId = prescription.Id,
                        MedicationName = item.MedicationName.Trim(),
                        Dosage = item.Dosage?.Trim(),
                        Frequency = item.Frequency?.Trim(),
                        Duration = item.Duration?.Trim(),
                        Quantity = item.Quantity,
                        Instructions = item.Instructions?.Trim(),
                        SortOrder = sortOrder++,
                        CreatedBy = _currentUserService.GetUserId()
                    });
                }
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

    public async Task<PrescriptionResponse> GetByIdAsync(Guid id)
    {
        var prescription = await _repository.GetByIdAsync(id);
        if (prescription is null)
            throw new NotFoundException("Prescription", id);

        return MapToResponse(prescription);
    }

    public async Task<List<PrescriptionResponse>> GetByVisitIdAsync(Guid visitId)
    {
        var items = await _repository.GetByVisitIdAsync(visitId);
        return items.Select(MapToResponse).ToList();
    }

    public async Task<PagedResult<PrescriptionListItemResponse>> GetByPatientIdAsync(Guid patientId, int page, int pageSize)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetByPatientIdAsync(patientId, page, pageSize);

        return new PagedResult<PrescriptionListItemResponse>
        {
            Items = items.Select(MapToListItem).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<PagedResult<PrescriptionListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        PrescriptionStatus? status)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetAllAsync(
            page, pageSize, search, doctorId, patientId, status);

        return new PagedResult<PrescriptionListItemResponse>
        {
            Items = items.Select(MapToListItem).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<PrescriptionResponse> CompleteAsync(Guid id)
    {
        var prescription = await _repository.GetByIdForUpdateAsync(id);
        if (prescription is null)
            throw new NotFoundException("Prescription", id);

        if (prescription.Status != PrescriptionStatus.Active)
            throw new BusinessException("Only active prescriptions can be completed.");

        prescription.Status = PrescriptionStatus.Completed;
        prescription.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<PrescriptionResponse> CancelAsync(Guid id)
    {
        var prescription = await _repository.GetByIdForUpdateAsync(id);
        if (prescription is null)
            throw new NotFoundException("Prescription", id);

        if (prescription.Status != PrescriptionStatus.Active)
            throw new BusinessException("Only active prescriptions can be cancelled.");

        prescription.Status = PrescriptionStatus.Cancelled;
        prescription.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task DeleteAsync(Guid id)
    {
        var prescription = await _repository.GetByIdForUpdateAsync(id);
        if (prescription is null)
            throw new NotFoundException("Prescription", id);

        _repository.SoftDelete(prescription);
        await _dbContext.SaveChangesAsync();
    }

    private static string BuildPatientName(Prescription prescription)
        => prescription.Patient is null
            ? string.Empty
            : $"{prescription.Patient.FirstName} {prescription.Patient.LastName}".Trim();

    private static string BuildDoctorName(Prescription prescription)
        => prescription.Doctor is null
            ? string.Empty
            : $"{prescription.Doctor.FirstName} {prescription.Doctor.LastName}".Trim();

    private static PrescriptionListItemResponse MapToListItem(Prescription prescription)
        => new()
        {
            Id = prescription.Id,
            PatientName = BuildPatientName(prescription),
            DoctorName = BuildDoctorName(prescription),
            PrescriptionDate = prescription.PrescriptionDate,
            ItemCount = prescription.Items.Count,
            Status = prescription.Status
        };

    private static PrescriptionResponse MapToResponse(Prescription prescription)
        => new()
        {
            Id = prescription.Id,
            VisitId = prescription.VisitId,
            VisitDate = prescription.Visit?.VisitDate ?? prescription.PrescriptionDate,
            PatientId = prescription.PatientId,
            PatientName = BuildPatientName(prescription),
            DoctorId = prescription.DoctorId,
            DoctorName = BuildDoctorName(prescription),
            PrescriptionDate = prescription.PrescriptionDate,
            Notes = prescription.Notes,
            Status = prescription.Status,
            ValidUntil = prescription.ValidUntil,
            Items = prescription.Items
                .OrderBy(i => i.SortOrder)
                .Select(i => new PrescriptionItemResponse
                {
                    Id = i.Id,
                    PrescriptionId = i.PrescriptionId,
                    MedicationName = i.MedicationName,
                    Dosage = i.Dosage,
                    Frequency = i.Frequency,
                    Duration = i.Duration,
                    Quantity = i.Quantity,
                    Instructions = i.Instructions,
                    SortOrder = i.SortOrder,
                    CreatedAt = i.CreatedAt,
                    UpdatedAt = i.UpdatedAt
                }).ToList(),
            CreatedAt = prescription.CreatedAt,
            UpdatedAt = prescription.UpdatedAt
        };
}
