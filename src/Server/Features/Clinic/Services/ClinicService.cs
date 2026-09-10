using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Clinic.Models;
using Server.Features.Clinic.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Clinic.Services;

public class ClinicService : IClinicService
{
    private readonly IClinicRepository _repository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public ClinicService(
        IClinicRepository repository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<ClinicProfileResponse> GetProfileAsync()
    {
        var profile = await _repository.GetProfileReadOnlyAsync();
        if (profile is null)
            throw new NotFoundException("Clinic profile is not configured yet.");

        return MapToProfileResponse(profile);
    }

    public async Task<ClinicProfileResponse> UpdateProfileAsync(UpdateClinicProfileRequest request)
    {
        var userId = _currentUserService.GetUserId();
        var profile = await _repository.GetProfileForUpdateAsync();

        if (profile is null)
        {
            profile = new ClinicProfile { CreatedBy = userId };
            MapToProfileEntity(request, profile);
            _repository.AddProfile(profile);
        }
        else
        {
            MapToProfileEntity(request, profile);
            profile.UpdatedBy = userId;
        }

        await _dbContext.SaveChangesAsync();
        return MapToProfileResponse(profile);
    }

    public async Task<ClinicSettingsResponse> GetSettingsAsync()
    {
        var settings = await _repository.GetSettingsReadOnlyAsync();
        if (settings is null)
            throw new NotFoundException("Clinic settings are not configured yet.");

        return MapToSettingsResponse(settings);
    }

    public async Task<ClinicSettingsResponse> UpdateSettingsAsync(UpdateClinicSettingsRequest request)
    {
        var userId = _currentUserService.GetUserId();
        var settings = await _repository.GetSettingsForUpdateAsync();

        if (settings is null)
        {
            settings = new ClinicSettings { CreatedBy = userId };
            MapToSettingsEntity(request, settings);
            _repository.AddSettings(settings);
        }
        else
        {
            MapToSettingsEntity(request, settings);
            settings.UpdatedBy = userId;
        }

        await _dbContext.SaveChangesAsync();
        return MapToSettingsResponse(settings);
    }

    private static void MapToProfileEntity(UpdateClinicProfileRequest request, ClinicProfile entity)
    {
        entity.Name = request.Name;
        entity.Logo = request.Logo;
        entity.Address = request.Address;
        entity.City = request.City;
        entity.Phone = request.Phone;
        entity.Email = request.Email;
        entity.WorkingHoursStart = request.WorkingHoursStart;
        entity.WorkingHoursEnd = request.WorkingHoursEnd;
        entity.About = request.About;
    }

    private static ClinicProfileResponse MapToProfileResponse(ClinicProfile entity)
    {
        return new ClinicProfileResponse
        {
            Id = entity.Id,
            Name = entity.Name,
            Logo = entity.Logo,
            Address = entity.Address,
            City = entity.City,
            Phone = entity.Phone,
            Email = entity.Email,
            WorkingHoursStart = entity.WorkingHoursStart,
            WorkingHoursEnd = entity.WorkingHoursEnd,
            About = entity.About
        };
    }

    private static void MapToSettingsEntity(UpdateClinicSettingsRequest request, ClinicSettings entity)
    {
        entity.CurrencyCode = request.CurrencyCode;
        entity.TimeZone = request.TimeZone;
        entity.AllowOnlineBooking = request.AllowOnlineBooking;
        entity.AppointmentDurationMinutes = request.AppointmentDurationMinutes;
        entity.MaxPatientsPerDay = request.MaxPatientsPerDay;
    }

    private static ClinicSettingsResponse MapToSettingsResponse(ClinicSettings entity)
    {
        return new ClinicSettingsResponse
        {
            Id = entity.Id,
            CurrencyCode = entity.CurrencyCode,
            TimeZone = entity.TimeZone,
            AllowOnlineBooking = entity.AllowOnlineBooking,
            AppointmentDurationMinutes = entity.AppointmentDurationMinutes,
            MaxPatientsPerDay = entity.MaxPatientsPerDay
        };
    }
}
