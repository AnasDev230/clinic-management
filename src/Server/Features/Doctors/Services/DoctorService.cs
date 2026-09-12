using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Core.Common;
using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Doctors.Models;
using Server.Features.Doctors.Repositories;
using Server.Features.Specialties.Repositories;
using Server.Infrastructure.Identity;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Doctors.Services;

public class DoctorService : IDoctorService
{
    private readonly IDoctorRepository _repository;
    private readonly ISpecialtyRepository _specialtyRepository;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public DoctorService(
        IDoctorRepository repository,
        ISpecialtyRepository specialtyRepository,
        UserManager<ApplicationUser> userManager,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _specialtyRepository = specialtyRepository;
        _userManager = userManager;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<DoctorResponse> CreateAsync(CreateDoctorRequest request)
    {
        var email = request.Email.Trim();

        if (await _repository.ExistsByEmailAsync(email))
            throw new BusinessException("A doctor with the same email already exists.");

        if (await _repository.ExistsByLicenseAsync(request.LicenseNumber))
            throw new BusinessException("A doctor with the same license number already exists.");

        var specialtyIds = request.SpecialtyIds.Distinct().ToList();
        await EnsureSpecialtiesExistAsync(specialtyIds);
        EnsureValidSchedules(request.Schedules);

        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var (userId, temporaryPassword) = await FindOrProvisionUserAsync(
                email, request.FirstName, request.LastName);

            var doctor = new Doctor
            {
                FirstName = request.FirstName.Trim(),
                LastName = request.LastName.Trim(),
                Email = email,
                Phone = request.Phone.Trim(),
                LicenseNumber = request.LicenseNumber.Trim(),
                YearsOfExperience = request.YearsOfExperience,
                Bio = request.Bio?.Trim(),
                IsActive = true,
                ApplicationUserId = userId,
                CreatedBy = _currentUserService.GetUserId()
            };

            foreach (var specialtyId in specialtyIds)
                doctor.DoctorSpecialties.Add(new DoctorSpecialty { SpecialtyId = specialtyId });

            foreach (var schedule in request.Schedules)
                doctor.DoctorSchedules.Add(ToScheduleEntity(schedule));

            await _repository.AddAsync(doctor);
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            var created = await _repository.GetByIdAsync(doctor.Id);
            return MapToResponse(created!, temporaryPassword);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<DoctorResponse> UpdateAsync(Guid id, UpdateDoctorRequest request)
    {
        var doctor = await _repository.GetByIdForUpdateAsync(id);
        if (doctor is null)
            throw new NotFoundException("Doctor", id);

        var email = request.Email.Trim();

        if (!string.Equals(doctor.Email, email, StringComparison.OrdinalIgnoreCase) &&
            await _repository.ExistsByEmailAsync(email, id))
        {
            throw new BusinessException("A doctor with the same email already exists.");
        }

        if (!string.Equals(doctor.LicenseNumber, request.LicenseNumber.Trim(), StringComparison.OrdinalIgnoreCase) &&
            await _repository.ExistsByLicenseAsync(request.LicenseNumber, id))
        {
            throw new BusinessException("A doctor with the same license number already exists.");
        }

        var specialtyIds = request.SpecialtyIds.Distinct().ToList();
        await EnsureSpecialtiesExistAsync(specialtyIds);
        EnsureValidSchedules(request.Schedules);

        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            string? temporaryPassword = null;

            if (!string.Equals(doctor.Email, email, StringComparison.OrdinalIgnoreCase))
            {
                var provisioned = await FindOrProvisionUserAsync(
                    email, request.FirstName, request.LastName);
                doctor.ApplicationUserId = provisioned.UserId;
                temporaryPassword = provisioned.TemporaryPassword;
            }

            doctor.FirstName = request.FirstName.Trim();
            doctor.LastName = request.LastName.Trim();
            doctor.Email = email;
            doctor.Phone = request.Phone.Trim();
            doctor.LicenseNumber = request.LicenseNumber.Trim();
            doctor.YearsOfExperience = request.YearsOfExperience;
            doctor.Bio = request.Bio?.Trim();
            doctor.IsActive = request.IsActive;
            doctor.UpdatedBy = _currentUserService.GetUserId();

            SyncSpecialties(doctor, specialtyIds);
            SyncSchedules(doctor, request.Schedules);

            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            var updated = await _repository.GetByIdAsync(id);
            return MapToResponse(updated!, temporaryPassword);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<DoctorResponse> GetByIdAsync(Guid id)
    {
        var doctor = await _repository.GetByIdAsync(id);
        if (doctor is null)
            throw new NotFoundException("Doctor", id);

        return MapToResponse(doctor, null);
    }

    public async Task<PagedResult<DoctorListItemResponse>> GetAllAsync(int page, int pageSize, string? search, bool? isActive, Guid? specialtyId)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetAllAsync(page, pageSize, search, isActive, specialtyId);

        return new PagedResult<DoctorListItemResponse>
        {
            Items = items.Select(d => new DoctorListItemResponse
            {
                Id = d.Id,
                FullName = BuildFullName(d.FirstName, d.LastName),
                Email = d.Email,
                Phone = d.Phone,
                LicenseNumber = d.LicenseNumber,
                Specialties = d.DoctorSpecialties
                    .Select(ds => ds.Specialty?.Name ?? string.Empty)
                    .Where(name => name != string.Empty)
                    .ToList(),
                IsActive = d.IsActive
            }).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<List<DoctorDropdownResponse>> GetForDropdownAsync()
    {
        var doctors = await _repository.GetForDropdownAsync();

        return doctors.Select(d => new DoctorDropdownResponse
        {
            Id = d.Id,
            FullName = BuildFullName(d.FirstName, d.LastName)
        }).ToList();
    }

    public async Task DeleteAsync(Guid id)
    {
        var doctor = await _repository.GetByIdForUpdateAsync(id);
        if (doctor is null)
            throw new NotFoundException("Doctor", id);

        // Soft delete: SaveChangesAsync converts this to DeletedAt (see AppDbContext).
        // The linked Identity user account is intentionally kept for audit purposes.
        _repository.SoftDelete(doctor);
        await _dbContext.SaveChangesAsync();
    }

    private async Task EnsureSpecialtiesExistAsync(List<Guid> specialtyIds)
    {
        foreach (var specialtyId in specialtyIds)
        {
            var specialty = await _specialtyRepository.GetByIdReadOnlyAsync(specialtyId);
            if (specialty is null)
                throw new BusinessException($"Specialty with id '{specialtyId}' was not found.");
        }
    }

    private static void EnsureValidSchedules(List<CreateScheduleRequest> schedules)
    {
        foreach (var schedule in schedules)
        {
            if (schedule.DayOfWeek < 0 || schedule.DayOfWeek > 6)
                throw new BusinessException("Day of week must be between 0 (Sunday) and 6 (Saturday).");

            if (schedule.EndTime <= schedule.StartTime)
                throw new BusinessException("Schedule end time must be after start time.");
        }
    }

    private static void SyncSpecialties(Doctor doctor, List<Guid> specialtyIds)
    {
        var toRemove = doctor.DoctorSpecialties
            .Where(ds => !specialtyIds.Contains(ds.SpecialtyId))
            .ToList();

        foreach (var link in toRemove)
            doctor.DoctorSpecialties.Remove(link);

        var existingIds = doctor.DoctorSpecialties.Select(ds => ds.SpecialtyId).ToHashSet();

        foreach (var specialtyId in specialtyIds.Where(sid => !existingIds.Contains(sid)))
            doctor.DoctorSpecialties.Add(new DoctorSpecialty { SpecialtyId = specialtyId });
    }

    private static void SyncSchedules(Doctor doctor, List<CreateScheduleRequest> schedules)
    {
        doctor.DoctorSchedules.Clear();

        foreach (var schedule in schedules)
            doctor.DoctorSchedules.Add(ToScheduleEntity(schedule));
    }

    private static DoctorSchedule ToScheduleEntity(CreateScheduleRequest schedule)
    {
        return new DoctorSchedule
        {
            DayOfWeek = schedule.DayOfWeek,
            StartTime = schedule.StartTime,
            EndTime = schedule.EndTime,
            IsActive = true
        };
    }

    /// <summary>
    /// Links the doctor to an existing Identity user with the same email,
    /// or provisions a new one (with the Doctor role) when none exists.
    /// Returns the user id plus a temporary password only when a new account was created.
    /// </summary>
    private async Task<(Guid UserId, string? TemporaryPassword)> FindOrProvisionUserAsync(
        string email, string firstName, string lastName)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is not null)
        {
            if (!await _userManager.IsInRoleAsync(user, "Doctor"))
                await _userManager.AddToRoleAsync(user, "Doctor");

            return (user.Id, null);
        }

        var temporaryPassword = GenerateSecurePassword();

        user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true,
            FullName = BuildFullName(firstName.Trim(), lastName.Trim())
        };

        var result = await _userManager.CreateAsync(user, temporaryPassword);
        if (!result.Succeeded)
        {
            throw new BusinessException(string.Join("; ",
                result.Errors.Select(e => e.Description)));
        }

        await _userManager.AddToRoleAsync(user, "Doctor");

        return (user.Id, temporaryPassword);
    }

    private static string GenerateSecurePassword()
    {
        const string lower = "abcdefghijkmnopqrstuvwxyz";
        const string upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        const string digits = "23456789";
        const string all = lower + upper + digits + "@#$%";

        var chars = new char[16];
        chars[0] = lower[RandomNumberGenerator.GetInt32(lower.Length)];
        chars[1] = upper[RandomNumberGenerator.GetInt32(upper.Length)];
        chars[2] = digits[RandomNumberGenerator.GetInt32(digits.Length)];

        for (var i = 3; i < chars.Length; i++)
            chars[i] = all[RandomNumberGenerator.GetInt32(all.Length)];

        return new string(chars.OrderBy(_ => RandomNumberGenerator.GetInt32(int.MaxValue)).ToArray());
    }

    private static string BuildFullName(string firstName, string lastName)
        => $"{firstName} {lastName}".Trim();

    private static DoctorResponse MapToResponse(Doctor doctor, string? temporaryPassword)
    {
        return new DoctorResponse
        {
            Id = doctor.Id,
            FirstName = doctor.FirstName,
            LastName = doctor.LastName,
            FullName = BuildFullName(doctor.FirstName, doctor.LastName),
            Email = doctor.Email,
            Phone = doctor.Phone,
            LicenseNumber = doctor.LicenseNumber,
            YearsOfExperience = doctor.YearsOfExperience,
            Bio = doctor.Bio,
            ProfileImage = doctor.ProfileImage,
            IsActive = doctor.IsActive,
            ApplicationUserId = doctor.ApplicationUserId,
            TemporaryPassword = temporaryPassword,
            Specialties = doctor.DoctorSpecialties
                .Select(ds => new DoctorSpecialtyItem
                {
                    SpecialtyId = ds.SpecialtyId,
                    SpecialtyName = ds.Specialty?.Name ?? string.Empty
                })
                .OrderBy(s => s.SpecialtyName)
                .ToList(),
            Schedules = doctor.DoctorSchedules
                .OrderBy(s => s.DayOfWeek)
                .ThenBy(s => s.StartTime)
                .Select(s => new DoctorScheduleItem
                {
                    Id = s.Id,
                    DayOfWeek = s.DayOfWeek,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    IsActive = s.IsActive
                })
                .ToList(),
            CreatedAt = doctor.CreatedAt,
            UpdatedAt = doctor.UpdatedAt
        };
    }
}
