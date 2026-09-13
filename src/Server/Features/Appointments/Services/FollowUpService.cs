using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Appointments.Models;
using Server.Features.Appointments.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Appointments.Services;

public class FollowUpService : IFollowUpService
{
    private readonly IFollowUpRepository _repository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public FollowUpService(
        IFollowUpRepository repository,
        IAppointmentRepository appointmentRepository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _appointmentRepository = appointmentRepository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<List<FollowUpResponse>> GetByAppointmentIdAsync(Guid appointmentId)
    {
        var items = await _repository.GetByAppointmentIdAsync(appointmentId);
        return items.Select(MapToResponse).ToList();
    }

    public async Task<FollowUpResponse> CreateAsync(Guid appointmentId, CreateFollowUpRequest request)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
        if (appointment is null)
            throw new NotFoundException("Appointment", appointmentId);

        var followUp = new FollowUp
        {
            AppointmentId = appointmentId,
            FollowUpDate = request.FollowUpDate,
            Notes = request.Notes?.Trim(),
            IsCompleted = false,
            CreatedBy = _currentUserService.GetUserId()
        };

        await _repository.AddAsync(followUp);
        await _dbContext.SaveChangesAsync();

        var created = await _repository.GetByIdAsync(followUp.Id);
        return MapToResponse(created!);
    }

    public async Task<FollowUpResponse> UpdateAsync(Guid id, UpdateFollowUpRequest request)
    {
        var followUp = await _repository.GetByIdForUpdateAsync(id);
        if (followUp is null)
            throw new NotFoundException("FollowUp", id);

        followUp.FollowUpDate = request.FollowUpDate;
        followUp.Notes = request.Notes?.Trim();
        followUp.UpdatedBy = _currentUserService.GetUserId();

        if (request.IsCompleted && !followUp.IsCompleted)
        {
            followUp.IsCompleted = true;
            followUp.CompletedAt = DateTime.UtcNow;
        }
        else if (!request.IsCompleted && followUp.IsCompleted)
        {
            followUp.IsCompleted = false;
            followUp.CompletedAt = null;
        }

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<FollowUpResponse> CompleteAsync(Guid id)
    {
        var followUp = await _repository.GetByIdForUpdateAsync(id);
        if (followUp is null)
            throw new NotFoundException("FollowUp", id);

        followUp.IsCompleted = true;
        followUp.CompletedAt = DateTime.UtcNow;
        followUp.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task DeleteAsync(Guid id)
    {
        var followUp = await _repository.GetByIdForUpdateAsync(id);
        if (followUp is null)
            throw new NotFoundException("FollowUp", id);

        _repository.SoftDelete(followUp);
        await _dbContext.SaveChangesAsync();
    }

    private static FollowUpResponse MapToResponse(FollowUp followUp)
    {
        return new FollowUpResponse
        {
            Id = followUp.Id,
            AppointmentId = followUp.AppointmentId,
            FollowUpDate = followUp.FollowUpDate,
            Notes = followUp.Notes,
            IsCompleted = followUp.IsCompleted,
            CompletedAt = followUp.CompletedAt,
            CreatedAt = followUp.CreatedAt,
            UpdatedAt = followUp.UpdatedAt
        };
    }
}
