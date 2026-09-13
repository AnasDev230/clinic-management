using Server.Core.Common;
using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Appointments.Models;
using Server.Features.Appointments.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Appointments.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _repository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public AppointmentService(
        IAppointmentRepository repository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<AppointmentResponse> CreateAsync(CreateAppointmentRequest request)
    {
        if (request.EndTime <= request.StartTime)
            throw new BusinessException("End time must be after start time.");

        var hasConflict = await _repository.CheckConflictAsync(
            request.DoctorId,
            request.AppointmentDate,
            request.StartTime,
            request.EndTime,
            null);

        if (hasConflict)
            throw new BusinessException("Schedule conflict: doctor already has an appointment at this time.");

        var appointment = new Appointment
        {
            PatientId = request.PatientId,
            DoctorId = request.DoctorId,
            AppointmentDate = request.AppointmentDate.Date,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Type = request.Type,
            Reason = request.Reason?.Trim(),
            Notes = request.Notes?.Trim(),
            Priority = request.Priority,
            DurationMinutes = request.DurationMinutes,
            Status = AppointmentStatus.Scheduled,
            CreatedBy = _currentUserService.GetUserId()
        };

        await _repository.AddAsync(appointment);
        await _dbContext.SaveChangesAsync();

        var created = await _repository.GetByIdAsync(appointment.Id);
        return MapToResponse(created!);
    }

    public async Task<AppointmentResponse> UpdateAsync(Guid id, UpdateAppointmentRequest request)
    {
        var appointment = await _repository.GetByIdForUpdateAsync(id);
        if (appointment is null)
            throw new NotFoundException("Appointment", id);

        if (request.EndTime <= request.StartTime)
            throw new BusinessException("End time must be after start time.");

        var hasConflict = await _repository.CheckConflictAsync(
            request.DoctorId,
            request.AppointmentDate,
            request.StartTime,
            request.EndTime,
            id);

        if (hasConflict)
            throw new BusinessException("Schedule conflict: doctor already has an appointment at this time.");

        appointment.PatientId = request.PatientId;
        appointment.DoctorId = request.DoctorId;
        appointment.AppointmentDate = request.AppointmentDate.Date;
        appointment.StartTime = request.StartTime;
        appointment.EndTime = request.EndTime;
        appointment.Type = request.Type;
        appointment.Reason = request.Reason?.Trim();
        appointment.Notes = request.Notes?.Trim();
        appointment.Priority = request.Priority;
        appointment.DurationMinutes = request.DurationMinutes;
        appointment.Status = request.Status;
        appointment.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<AppointmentResponse> CancelAsync(Guid id, CancelAppointmentRequest request)
    {
        var appointment = await _repository.GetByIdForUpdateAsync(id);
        if (appointment is null)
            throw new NotFoundException("Appointment", id);

        if (appointment.Status != AppointmentStatus.Scheduled &&
            appointment.Status != AppointmentStatus.Confirmed)
            throw new BusinessException("Only scheduled or confirmed appointments can be cancelled.");

        appointment.Status = AppointmentStatus.Cancelled;
        appointment.CancelledAt = DateTime.UtcNow;
        appointment.CancellationReason = request.CancellationReason.Trim();
        appointment.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<AppointmentResponse> ConfirmAsync(Guid id)
    {
        var appointment = await _repository.GetByIdForUpdateAsync(id);
        if (appointment is null)
            throw new NotFoundException("Appointment", id);

        if (appointment.Status != AppointmentStatus.Scheduled)
            throw new BusinessException("Only scheduled appointments can be confirmed.");

        appointment.Status = AppointmentStatus.Confirmed;
        appointment.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<AppointmentResponse> StartAsync(Guid id)
    {
        var appointment = await _repository.GetByIdForUpdateAsync(id);
        if (appointment is null)
            throw new NotFoundException("Appointment", id);

        if (appointment.Status != AppointmentStatus.Confirmed)
            throw new BusinessException("Only confirmed appointments can be started.");

        appointment.Status = AppointmentStatus.InProgress;
        appointment.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<AppointmentResponse> CompleteAsync(Guid id)
    {
        var appointment = await _repository.GetByIdForUpdateAsync(id);
        if (appointment is null)
            throw new NotFoundException("Appointment", id);

        if (appointment.Status != AppointmentStatus.InProgress)
            throw new BusinessException("Only in-progress appointments can be completed.");

        appointment.Status = AppointmentStatus.Completed;
        appointment.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<AppointmentResponse> MarkNoShowAsync(Guid id)
    {
        var appointment = await _repository.GetByIdForUpdateAsync(id);
        if (appointment is null)
            throw new NotFoundException("Appointment", id);

        if (appointment.Status != AppointmentStatus.Scheduled &&
            appointment.Status != AppointmentStatus.Confirmed)
            throw new BusinessException("Only scheduled or confirmed appointments can be marked as no-show.");

        appointment.Status = AppointmentStatus.NoShow;
        appointment.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<AppointmentResponse> GetByIdAsync(Guid id)
    {
        var appointment = await _repository.GetByIdAsync(id);
        if (appointment is null)
            throw new NotFoundException("Appointment", id);

        return MapToResponse(appointment);
    }

    public async Task<PagedResult<AppointmentListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        AppointmentStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetAllAsync(
            page, pageSize, search, doctorId, patientId, status, dateFrom, dateTo);

        return new PagedResult<AppointmentListItemResponse>
        {
            Items = items.Select(a => new AppointmentListItemResponse
            {
                Id = a.Id,
                PatientName = BuildPatientName(a),
                DoctorName = BuildDoctorName(a),
                AppointmentDate = a.AppointmentDate,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                Status = a.Status,
                Type = a.Type,
                Priority = a.Priority
            }).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<List<AppointmentCalendarResponse>> GetTodayAsync()
    {
        var items = await _repository.GetTodayAppointmentsAsync();
        return items.Select(MapToCalendar).ToList();
    }

    public async Task<List<AppointmentCalendarResponse>> GetByDoctorAndDateAsync(Guid doctorId, DateTime date)
    {
        var items = await _repository.GetByDoctorAndDateAsync(doctorId, date);
        return items.Select(MapToCalendar).ToList();
    }

    public async Task DeleteAsync(Guid id)
    {
        var appointment = await _repository.GetByIdForUpdateAsync(id);
        if (appointment is null)
            throw new NotFoundException("Appointment", id);

        _repository.SoftDelete(appointment);
        await _dbContext.SaveChangesAsync();
    }

    private static string BuildPatientName(Appointment appointment)
        => appointment.Patient is null
            ? string.Empty
            : $"{appointment.Patient.FirstName} {appointment.Patient.LastName}".Trim();

    private static string BuildDoctorName(Appointment appointment)
        => appointment.Doctor is null
            ? string.Empty
            : $"{appointment.Doctor.FirstName} {appointment.Doctor.LastName}".Trim();

    private static AppointmentResponse MapToResponse(Appointment appointment)
    {
        return new AppointmentResponse
        {
            Id = appointment.Id,
            PatientId = appointment.PatientId,
            PatientName = BuildPatientName(appointment),
            DoctorId = appointment.DoctorId,
            DoctorName = BuildDoctorName(appointment),
            AppointmentDate = appointment.AppointmentDate,
            StartTime = appointment.StartTime,
            EndTime = appointment.EndTime,
            Status = appointment.Status,
            Type = appointment.Type,
            Reason = appointment.Reason,
            Notes = appointment.Notes,
            Priority = appointment.Priority,
            DurationMinutes = appointment.DurationMinutes,
            CancelledAt = appointment.CancelledAt,
            CancellationReason = appointment.CancellationReason,
            VisitId = appointment.VisitId,
            CreatedAt = appointment.CreatedAt,
            UpdatedAt = appointment.UpdatedAt
        };
    }

    private static AppointmentCalendarResponse MapToCalendar(Appointment appointment)
    {
        return new AppointmentCalendarResponse
        {
            Id = appointment.Id,
            PatientName = BuildPatientName(appointment),
            DoctorName = BuildDoctorName(appointment),
            AppointmentDate = appointment.AppointmentDate,
            StartTime = appointment.StartTime,
            EndTime = appointment.EndTime,
            Status = appointment.Status,
            Type = appointment.Type
        };
    }
}
