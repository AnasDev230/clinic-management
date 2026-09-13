using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Visits.Models;
using Server.Features.Visits.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Visits.Services;

public class VisitVitalsService : IVisitVitalsService
{
    private readonly IVisitVitalsRepository _repository;
    private readonly IVisitRepository _visitRepository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public VisitVitalsService(
        IVisitVitalsRepository repository,
        IVisitRepository visitRepository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _visitRepository = visitRepository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<VitalsResponse?> GetByVisitIdAsync(Guid visitId)
    {
        var vitals = await _repository.GetByVisitIdAsync(visitId);
        return vitals is null ? null : MapToResponse(vitals);
    }

    public async Task<VitalsResponse> CreateOrUpdateAsync(Guid visitId, CreateVitalsRequest request)
    {
        var visit = await _visitRepository.GetByIdAsync(visitId);
        if (visit is null)
            throw new NotFoundException("Visit", visitId);

        var existing = await _repository.GetByVisitIdForUpdateAsync(visitId);

        var bmi = CalculateBmi(request.Weight, request.Height);

        if (existing is null)
        {
            var vitals = new VisitVitals
            {
                VisitId = visitId,
                Temperature = request.Temperature,
                BloodPressureSystolic = request.BloodPressureSystolic,
                BloodPressureDiastolic = request.BloodPressureDiastolic,
                HeartRate = request.HeartRate,
                RespiratoryRate = request.RespiratoryRate,
                OxygenSaturation = request.OxygenSaturation,
                Weight = request.Weight,
                Height = request.Height,
                BMI = bmi,
                Notes = request.Notes?.Trim(),
                CreatedBy = _currentUserService.GetUserId()
            };

            await _repository.AddAsync(vitals);
            await _dbContext.SaveChangesAsync();

            var created = await _repository.GetByVisitIdAsync(visitId);
            return MapToResponse(created!);
        }

        existing.Temperature = request.Temperature;
        existing.BloodPressureSystolic = request.BloodPressureSystolic;
        existing.BloodPressureDiastolic = request.BloodPressureDiastolic;
        existing.HeartRate = request.HeartRate;
        existing.RespiratoryRate = request.RespiratoryRate;
        existing.OxygenSaturation = request.OxygenSaturation;
        existing.Weight = request.Weight;
        existing.Height = request.Height;
        existing.BMI = bmi;
        existing.Notes = request.Notes?.Trim();
        existing.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByVisitIdAsync(visitId);
        return MapToResponse(updated!);
    }

    private static decimal? CalculateBmi(decimal? weightKg, decimal? heightCm)
    {
        if (!weightKg.HasValue || !heightCm.HasValue || heightCm.Value <= 0)
            return null;

        var heightM = (double)heightCm.Value / 100.0;
        var bmi = (double)weightKg.Value / (heightM * heightM);
        return Math.Round((decimal)bmi, 1);
    }

    private static VitalsResponse MapToResponse(VisitVitals vitals)
    {
        return new VitalsResponse
        {
            Id = vitals.Id,
            VisitId = vitals.VisitId,
            Temperature = vitals.Temperature,
            BloodPressureSystolic = vitals.BloodPressureSystolic,
            BloodPressureDiastolic = vitals.BloodPressureDiastolic,
            HeartRate = vitals.HeartRate,
            RespiratoryRate = vitals.RespiratoryRate,
            OxygenSaturation = vitals.OxygenSaturation,
            Weight = vitals.Weight,
            Height = vitals.Height,
            BMI = vitals.BMI,
            Notes = vitals.Notes,
            CreatedAt = vitals.CreatedAt,
            UpdatedAt = vitals.UpdatedAt
        };
    }
}
