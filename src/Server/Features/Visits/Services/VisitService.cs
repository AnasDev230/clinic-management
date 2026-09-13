using Server.Core.Common;
using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Appointments.Repositories;
using Server.Features.Visits.Models;
using Server.Features.Visits.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Visits.Services;

public class VisitService : IVisitService
{
    private readonly IVisitRepository _repository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public VisitService(
        IVisitRepository repository,
        IAppointmentRepository appointmentRepository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _appointmentRepository = appointmentRepository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<VisitResponse> CreateAsync(CreateVisitRequest request)
    {
        var appointment = await _appointmentRepository.GetByIdForUpdateAsync(request.AppointmentId);
        if (appointment is null)
            throw new NotFoundException("Appointment", request.AppointmentId);

        if (appointment.Status != AppointmentStatus.InProgress)
            throw new BusinessException("A visit can only be created for an in-progress appointment.");

        var existing = await _repository.GetByAppointmentIdAsync(request.AppointmentId);
        if (existing is not null)
            throw new BusinessException("A visit already exists for this appointment.");

        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var visit = new Visit
            {
                AppointmentId = appointment.Id,
                PatientId = appointment.PatientId,
                DoctorId = appointment.DoctorId,
                VisitDate = DateTime.UtcNow,
                ChiefComplaint = request.ChiefComplaint?.Trim(),
                Symptoms = request.Symptoms?.Trim(),
                Notes = request.Notes?.Trim(),
                Status = VisitStatus.Waiting,
                TotalAmount = 0m,
                DiscountAmount = 0m,
                FinalAmount = 0m,
                CreatedBy = _currentUserService.GetUserId()
            };

            await _repository.AddAsync(visit);
            await _dbContext.SaveChangesAsync();

            appointment.VisitId = visit.Id;
            appointment.UpdatedBy = _currentUserService.GetUserId();
            await _dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            var created = await _repository.GetByIdAsync(visit.Id);
            return MapToResponse(created!);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<VisitResponse> UpdateAsync(Guid id, UpdateVisitRequest request)
    {
        var visit = await _repository.GetByIdForUpdateAsync(id);
        if (visit is null)
            throw new NotFoundException("Visit", id);

        if (request.DiscountAmount > request.TotalAmount)
            throw new BusinessException("Discount amount must not exceed total amount.");

        visit.ChiefComplaint = request.ChiefComplaint?.Trim();
        visit.Symptoms = request.Symptoms?.Trim();
        visit.Diagnosis = request.Diagnosis?.Trim();
        visit.TreatmentPlan = request.TreatmentPlan?.Trim();
        visit.Notes = request.Notes?.Trim();
        visit.NextVisitRecommended = request.NextVisitRecommended;
        visit.NextVisitNotes = request.NextVisitNotes?.Trim();
        visit.TotalAmount = request.TotalAmount;
        visit.DiscountAmount = request.DiscountAmount;
        visit.FinalAmount = request.TotalAmount - request.DiscountAmount;
        visit.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<VisitResponse> StartConsultationAsync(Guid id)
    {
        var visit = await _repository.GetByIdForUpdateAsync(id);
        if (visit is null)
            throw new NotFoundException("Visit", id);

        if (visit.Status != VisitStatus.Waiting)
            throw new BusinessException("Only waiting visits can start consultation.");

        visit.Status = VisitStatus.InConsultation;
        visit.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<VisitResponse> CompleteAsync(Guid id)
    {
        var visit = await _repository.GetByIdForUpdateAsync(id);
        if (visit is null)
            throw new NotFoundException("Visit", id);

        if (visit.Status != VisitStatus.InConsultation)
            throw new BusinessException("Only visits in consultation can be completed.");

        visit.Status = VisitStatus.Completed;
        visit.FinalAmount = visit.TotalAmount - visit.DiscountAmount;
        visit.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<VisitResponse> GetByIdAsync(Guid id)
    {
        var visit = await _repository.GetByIdAsync(id);
        if (visit is null)
            throw new NotFoundException("Visit", id);

        return MapToResponse(visit);
    }

    public async Task<PagedResult<VisitListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? doctorId,
        Guid? patientId,
        VisitStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetAllAsync(
            page, pageSize, search, doctorId, patientId, status, dateFrom, dateTo);

        return new PagedResult<VisitListItemResponse>
        {
            Items = items.Select(v => new VisitListItemResponse
            {
                Id = v.Id,
                PatientName = BuildPatientName(v),
                DoctorName = BuildDoctorName(v),
                VisitDate = v.VisitDate,
                Status = v.Status,
                TotalAmount = v.TotalAmount
            }).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<List<VisitListItemResponse>> GetTodayAsync()
    {
        var items = await _repository.GetTodayVisitsAsync();

        return items.Select(v => new VisitListItemResponse
        {
            Id = v.Id,
            PatientName = BuildPatientName(v),
            DoctorName = BuildDoctorName(v),
            VisitDate = v.VisitDate,
            Status = v.Status,
            TotalAmount = v.TotalAmount
        }).ToList();
    }

    public async Task DeleteAsync(Guid id)
    {
        var visit = await _repository.GetByIdForUpdateAsync(id);
        if (visit is null)
            throw new NotFoundException("Visit", id);

        _repository.SoftDelete(visit);
        await _dbContext.SaveChangesAsync();
    }

    private static string BuildPatientName(Visit visit)
        => visit.Patient is null
            ? string.Empty
            : $"{visit.Patient.FirstName} {visit.Patient.LastName}".Trim();

    private static string BuildDoctorName(Visit visit)
        => visit.Doctor is null
            ? string.Empty
            : $"{visit.Doctor.FirstName} {visit.Doctor.LastName}".Trim();

    private static VisitResponse MapToResponse(Visit visit)
    {
        return new VisitResponse
        {
            Id = visit.Id,
            AppointmentId = visit.AppointmentId,
            AppointmentDate = visit.Appointment?.AppointmentDate ?? visit.VisitDate,
            PatientId = visit.PatientId,
            PatientName = BuildPatientName(visit),
            DoctorId = visit.DoctorId,
            DoctorName = BuildDoctorName(visit),
            VisitDate = visit.VisitDate,
            ChiefComplaint = visit.ChiefComplaint,
            Symptoms = visit.Symptoms,
            Diagnosis = visit.Diagnosis,
            TreatmentPlan = visit.TreatmentPlan,
            Notes = visit.Notes,
            Status = visit.Status,
            NextVisitRecommended = visit.NextVisitRecommended,
            NextVisitNotes = visit.NextVisitNotes,
            TotalAmount = visit.TotalAmount,
            DiscountAmount = visit.DiscountAmount,
            FinalAmount = visit.FinalAmount,
            Diagnoses = visit.Diagnoses
                .Select(d => new DiagnosisResponse
                {
                    Id = d.Id,
                    VisitId = d.VisitId,
                    Code = d.Code,
                    Name = d.Name,
                    Description = d.Description,
                    IsPrimary = d.IsPrimary,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                }).ToList(),
            Vitals = visit.Vitals is null ? null : new VitalsResponse
            {
                Id = visit.Vitals.Id,
                VisitId = visit.Vitals.VisitId,
                Temperature = visit.Vitals.Temperature,
                BloodPressureSystolic = visit.Vitals.BloodPressureSystolic,
                BloodPressureDiastolic = visit.Vitals.BloodPressureDiastolic,
                HeartRate = visit.Vitals.HeartRate,
                RespiratoryRate = visit.Vitals.RespiratoryRate,
                OxygenSaturation = visit.Vitals.OxygenSaturation,
                Weight = visit.Vitals.Weight,
                Height = visit.Vitals.Height,
                BMI = visit.Vitals.BMI,
                Notes = visit.Vitals.Notes,
                CreatedAt = visit.Vitals.CreatedAt,
                UpdatedAt = visit.Vitals.UpdatedAt
            },
            CreatedAt = visit.CreatedAt,
            UpdatedAt = visit.UpdatedAt
        };
    }
}
