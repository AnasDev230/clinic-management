using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Server.Features.Dashboard.Models;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Dashboard.Repositories;

public class DashboardRepository : IDashboardRepository
{
    private readonly AppDbContext _dbContext;

    public DashboardRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DashboardOverviewResponse> GetOverviewAsync()
    {
        var now = DateTime.UtcNow;
        var todayStart = now.Date;
        var todayEnd = todayStart.AddDays(1);
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var nextMonthStart = monthStart.AddMonths(1);

        var totalPatients = await _dbContext.Patients
            .AsNoTracking()
            .CountAsync();

        var totalDoctors = await _dbContext.Doctors
            .AsNoTracking()
            .CountAsync(d => d.IsActive);

        var todayAppointments = await _dbContext.Appointments
            .AsNoTracking()
            .CountAsync(a => a.AppointmentDate >= todayStart && a.AppointmentDate < todayEnd);

        var todayRevenue = await _dbContext.Payments
            .AsNoTracking()
            .Where(p => p.PaymentDate >= todayStart
                && p.PaymentDate < todayEnd
                && p.Status == PaymentStatus.Completed)
            .SumAsync(p => (decimal?)p.Amount) ?? 0;

        var pendingLabTests = await _dbContext.LabTests
            .AsNoTracking()
            .CountAsync(l => l.Status == LabTestStatus.Ordered
                || l.Status == LabTestStatus.InProgress);

        var overdueInvoices = await _dbContext.Invoices
            .AsNoTracking()
            .CountAsync(i => i.Status == InvoiceStatus.Overdue);

        var monthlyRevenue = await _dbContext.Payments
            .AsNoTracking()
            .Where(p => p.PaymentDate >= monthStart
                && p.PaymentDate < nextMonthStart
                && p.Status == PaymentStatus.Completed)
            .SumAsync(p => (decimal?)p.Amount) ?? 0;

        var newPatientsThisMonth = await _dbContext.Patients
            .AsNoTracking()
            .CountAsync(p => p.CreatedAt >= monthStart && p.CreatedAt < nextMonthStart);

        return new DashboardOverviewResponse
        {
            TotalPatients = totalPatients,
            TotalDoctors = totalDoctors,
            TodayAppointments = todayAppointments,
            TodayRevenue = todayRevenue,
            PendingLabTests = pendingLabTests,
            OverdueInvoices = overdueInvoices,
            MonthlyRevenue = monthlyRevenue,
            NewPatientsThisMonth = newPatientsThisMonth
        };
    }

    public async Task<TodaySummaryResponse> GetTodaySummaryAsync()
    {
        var now = DateTime.UtcNow;
        var todayStart = now.Date;
        var todayEnd = todayStart.AddDays(1);

        var todayAppointmentsQuery = _dbContext.Appointments
            .AsNoTracking()
            .Where(a => a.AppointmentDate >= todayStart && a.AppointmentDate < todayEnd);

        var totalAppointments = await todayAppointmentsQuery.CountAsync();
        var completedAppointments = await todayAppointmentsQuery
            .CountAsync(a => a.Status == AppointmentStatus.Completed);
        var cancelledAppointments = await todayAppointmentsQuery
            .CountAsync(a => a.Status == AppointmentStatus.Cancelled);

        var todayVisitsQuery = _dbContext.Visits
            .AsNoTracking()
            .Where(v => v.VisitDate >= todayStart && v.VisitDate < todayEnd);

        var todayVisits = await todayVisitsQuery.CountAsync();
        var waitingPatients = await todayVisitsQuery
            .CountAsync(v => v.Status == VisitStatus.Waiting);
        var inConsultation = await todayVisitsQuery
            .CountAsync(v => v.Status == VisitStatus.InConsultation);

        var todayRevenue = await _dbContext.Payments
            .AsNoTracking()
            .Where(p => p.PaymentDate >= todayStart
                && p.PaymentDate < todayEnd
                && p.Status == PaymentStatus.Completed)
            .SumAsync(p => (decimal?)p.Amount) ?? 0;

        var upcomingRaw = await _dbContext.Appointments
            .AsNoTracking()
            .Where(a => a.AppointmentDate >= todayStart && a.AppointmentDate < todayEnd)
            .OrderBy(a => a.StartTime)
            .Take(5)
            .Select(a => new
            {
                a.Id,
                PatientFirstName = a.Patient != null ? a.Patient.FirstName : string.Empty,
                PatientLastName = a.Patient != null ? a.Patient.LastName : string.Empty,
                DoctorFirstName = a.Doctor != null ? a.Doctor.FirstName : string.Empty,
                DoctorLastName = a.Doctor != null ? a.Doctor.LastName : string.Empty,
                a.StartTime,
                a.EndTime,
                a.Status,
                a.Type
            })
            .ToListAsync();

        return new TodaySummaryResponse
        {
            TotalAppointments = totalAppointments,
            CompletedAppointments = completedAppointments,
            CancelledAppointments = cancelledAppointments,
            WaitingPatients = waitingPatients,
            InConsultation = inConsultation,
            TodayRevenue = todayRevenue,
            TodayVisits = todayVisits,
            UpcomingAppointments = upcomingRaw.Select(a => new TodayAppointmentItem
            {
                Id = a.Id,
                PatientName = $"{a.PatientFirstName} {a.PatientLastName}".Trim(),
                DoctorName = $"{a.DoctorFirstName} {a.DoctorLastName}".Trim(),
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                Status = a.Status.ToString(),
                Type = a.Type.ToString()
            }).ToList()
        };
    }

    public async Task<WeeklyStatsResponse> GetWeeklyStatsAsync(DateTime startDate)
    {
        var start = startDate.Date;
        var days = new List<DailyStat>();
        var totalAppointments = 0;
        decimal totalRevenue = 0;

        for (var i = 0; i < 7; i++)
        {
            var dayStart = start.AddDays(i);
            var dayEnd = dayStart.AddDays(1);

            var appointmentsCount = await _dbContext.Appointments
                .AsNoTracking()
                .CountAsync(a => a.AppointmentDate >= dayStart && a.AppointmentDate < dayEnd);

            var revenue = await _dbContext.Payments
                .AsNoTracking()
                .Where(p => p.PaymentDate >= dayStart
                    && p.PaymentDate < dayEnd
                    && p.Status == PaymentStatus.Completed)
                .SumAsync(p => (decimal?)p.Amount) ?? 0;

            totalAppointments += appointmentsCount;
            totalRevenue += revenue;

            days.Add(new DailyStat
            {
                DayName = dayStart.DayOfWeek.ToString(),
                Date = dayStart,
                AppointmentsCount = appointmentsCount,
                Revenue = revenue
            });
        }

        return new WeeklyStatsResponse
        {
            Days = days,
            TotalAppointments = totalAppointments,
            TotalRevenue = totalRevenue
        };
    }

    public async Task<MonthlyStatsResponse> GetMonthlyStatsAsync(int year, int month)
    {
        var monthStart = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
        var nextMonthStart = monthStart.AddMonths(1);
        var daysInMonth = DateTime.DaysInMonth(year, month);

        var appointmentsQuery = _dbContext.Appointments
            .AsNoTracking()
            .Where(a => a.AppointmentDate >= monthStart && a.AppointmentDate < nextMonthStart);

        var visitsQuery = _dbContext.Visits
            .AsNoTracking()
            .Where(v => v.VisitDate >= monthStart && v.VisitDate < nextMonthStart);

        var paymentsQuery = _dbContext.Payments
            .AsNoTracking()
            .Where(p => p.PaymentDate >= monthStart
                && p.PaymentDate < nextMonthStart
                && p.Status == PaymentStatus.Completed);

        var invoicesQuery = _dbContext.Invoices
            .AsNoTracking()
            .Where(i => i.InvoiceDate >= monthStart && i.InvoiceDate < nextMonthStart);

        var totalAppointments = await appointmentsQuery.CountAsync();
        var totalVisits = await visitsQuery.CountAsync();
        var totalPatients = await _dbContext.Patients.AsNoTracking().CountAsync();
        var newPatients = await _dbContext.Patients
            .AsNoTracking()
            .CountAsync(p => p.CreatedAt >= monthStart && p.CreatedAt < nextMonthStart);
        var totalRevenue = await paymentsQuery.SumAsync(p => (decimal?)p.Amount) ?? 0;
        var totalPaid = await invoicesQuery.SumAsync(i => (decimal?)i.PaidAmount) ?? 0;
        var totalOutstanding = await invoicesQuery.SumAsync(i => (decimal?)i.RemainingAmount) ?? 0;
        var totalLabTests = await _dbContext.LabTests
            .AsNoTracking()
            .CountAsync(l => l.OrderedDate >= monthStart && l.OrderedDate < nextMonthStart);
        var totalPrescriptions = await _dbContext.Prescriptions
            .AsNoTracking()
            .CountAsync(p => p.PrescriptionDate >= monthStart && p.PrescriptionDate < nextMonthStart);

        var dailyBreakdown = new List<DailyStat>();
        for (var day = 1; day <= daysInMonth; day++)
        {
            var dayStart = new DateTime(year, month, day, 0, 0, 0, DateTimeKind.Utc);
            var dayEnd = dayStart.AddDays(1);

            var dayAppointments = await _dbContext.Appointments
                .AsNoTracking()
                .CountAsync(a => a.AppointmentDate >= dayStart && a.AppointmentDate < dayEnd);

            var dayRevenue = await _dbContext.Payments
                .AsNoTracking()
                .Where(p => p.PaymentDate >= dayStart
                    && p.PaymentDate < dayEnd
                    && p.Status == PaymentStatus.Completed)
                .SumAsync(p => (decimal?)p.Amount) ?? 0;

            dailyBreakdown.Add(new DailyStat
            {
                DayName = dayStart.DayOfWeek.ToString(),
                Date = dayStart,
                AppointmentsCount = dayAppointments,
                Revenue = dayRevenue
            });
        }

        return new MonthlyStatsResponse
        {
            Year = year,
            Month = month,
            TotalAppointments = totalAppointments,
            TotalVisits = totalVisits,
            TotalPatients = totalPatients,
            NewPatients = newPatients,
            TotalRevenue = totalRevenue,
            TotalPaid = totalPaid,
            TotalOutstanding = totalOutstanding,
            TotalLabTests = totalLabTests,
            TotalPrescriptions = totalPrescriptions,
            DailyBreakdown = dailyBreakdown
        };
    }

    public async Task<List<TopDoctorItem>> GetTopDoctorsAsync(int year, int month, int limit)
    {
        var monthStart = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
        var nextMonthStart = monthStart.AddMonths(1);
        var safeLimit = Math.Clamp(limit, 1, 50);

        var groups = await _dbContext.Appointments
            .AsNoTracking()
            .Where(a => a.AppointmentDate >= monthStart && a.AppointmentDate < nextMonthStart)
            .GroupBy(a => a.DoctorId)
            .Select(g => new { DoctorId = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(safeLimit)
            .ToListAsync();

        var result = new List<TopDoctorItem>();
        foreach (var group in groups)
        {
            var doctor = await _dbContext.Doctors
                .AsNoTracking()
                .Include(d => d.DoctorSpecialties)
                .FirstOrDefaultAsync(d => d.Id == group.DoctorId);

            if (doctor is null)
                continue;

            string specialtyName = string.Empty;
            var specialtyLink = doctor.DoctorSpecialties.FirstOrDefault();
            if (specialtyLink is not null)
            {
                var specialty = await _dbContext.Specialties
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.Id == specialtyLink.SpecialtyId);
                specialtyName = specialty?.Name ?? string.Empty;
            }

            var completedVisits = await _dbContext.Visits
                .AsNoTracking()
                .CountAsync(v => v.DoctorId == group.DoctorId
                    && v.VisitDate >= monthStart
                    && v.VisitDate < nextMonthStart
                    && v.Status == VisitStatus.Completed);

            var revenue = await _dbContext.Payments
                .AsNoTracking()
                .Where(p => p.PaymentDate >= monthStart
                    && p.PaymentDate < nextMonthStart
                    && p.Status == PaymentStatus.Completed
                    && p.Invoice != null
                    && p.Invoice.DoctorId == group.DoctorId)
                .SumAsync(p => (decimal?)p.Amount) ?? 0;

            result.Add(new TopDoctorItem
            {
                DoctorId = doctor.Id,
                DoctorName = $"{doctor.FirstName} {doctor.LastName}".Trim(),
                SpecialtyName = specialtyName,
                AppointmentsCount = group.Count,
                CompletedVisits = completedVisits,
                Revenue = revenue
            });
        }

        return result;
    }

    public async Task<RevenueSummaryResponse> GetRevenueSummaryAsync(int year, int month)
    {
        var monthStart = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
        var nextMonthStart = monthStart.AddMonths(1);

        var invoicesQuery = _dbContext.Invoices
            .AsNoTracking()
            .Where(i => i.InvoiceDate >= monthStart && i.InvoiceDate < nextMonthStart);

        var totalRevenue = await invoicesQuery.SumAsync(i => (decimal?)i.TotalAmount) ?? 0;
        var totalPaid = await invoicesQuery.SumAsync(i => (decimal?)i.PaidAmount) ?? 0;
        var totalOutstanding = await invoicesQuery.SumAsync(i => (decimal?)i.RemainingAmount) ?? 0;
        var totalOverdue = await invoicesQuery
            .Where(i => i.Status == InvoiceStatus.Overdue)
            .SumAsync(i => (decimal?)i.RemainingAmount) ?? 0;

        var totalInvoices = await invoicesQuery.CountAsync();
        var paidInvoices = await invoicesQuery
            .CountAsync(i => i.Status == InvoiceStatus.Paid);
        var overdueInvoices = await invoicesQuery
            .CountAsync(i => i.Status == InvoiceStatus.Overdue);

        var methodGroups = await _dbContext.Payments
            .AsNoTracking()
            .Where(p => p.PaymentDate >= monthStart
                && p.PaymentDate < nextMonthStart
                && p.Status == PaymentStatus.Completed)
            .GroupBy(p => p.PaymentMethod)
            .Select(g => new
            {
                Method = g.Key,
                Count = g.Count(),
                Amount = g.Sum(p => (decimal?)p.Amount) ?? 0
            })
            .ToListAsync();

        return new RevenueSummaryResponse
        {
            TotalRevenue = totalRevenue,
            TotalPaid = totalPaid,
            TotalOutstanding = totalOutstanding,
            TotalOverdue = totalOverdue,
            TotalInvoices = totalInvoices,
            PaidInvoices = paidInvoices,
            OverdueInvoices = overdueInvoices,
            ByMethod = methodGroups.Select(g => new PaymentMethodBreakdown
            {
                Method = g.Method.ToString(),
                Count = g.Count,
                Amount = g.Amount
            }).ToList()
        };
    }

    public async Task<List<AppointmentsByStatusResponse>> GetAppointmentsByStatusAsync(
        DateTime dateFrom, DateTime dateTo)
    {
        var from = dateFrom.Date;
        var to = dateTo.Date.AddDays(1);

        var groups = await _dbContext.Appointments
            .AsNoTracking()
            .Where(a => a.AppointmentDate >= from && a.AppointmentDate < to)
            .GroupBy(a => a.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        return groups.Select(g => new AppointmentsByStatusResponse
        {
            Status = g.Status.ToString(),
            Count = g.Count
        }).ToList();
    }

    public async Task<PatientsGrowthResponse> GetPatientsGrowthAsync(int months)
    {
        var safeMonths = Math.Clamp(months, 1, 24);
        var now = DateTime.UtcNow;
        var result = new PatientsGrowthResponse();

        for (var i = safeMonths - 1; i >= 0; i--)
        {
            var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc)
                .AddMonths(-i);
            var nextMonthStart = monthStart.AddMonths(1);

            var newPatients = await _dbContext.Patients
                .AsNoTracking()
                .CountAsync(p => p.CreatedAt >= monthStart && p.CreatedAt < nextMonthStart);

            var totalPatients = await _dbContext.Patients
                .AsNoTracking()
                .CountAsync(p => p.CreatedAt < nextMonthStart);

            result.Months.Add(new MonthlyGrowth
            {
                MonthName = monthStart.ToString("MMM", CultureInfo.InvariantCulture),
                Year = monthStart.Year,
                NewPatients = newPatients,
                TotalPatients = totalPatients
            });
        }

        return result;
    }

    public async Task<List<RecentActivityItem>> GetRecentActivityAsync(int count)
    {
        var safeCount = Math.Clamp(count, 1, 100);

        var logs = await _dbContext.AuditLogs
            .AsNoTracking()
            .OrderByDescending(a => a.Timestamp)
            .Take(safeCount)
            .Select(a => new
            {
                a.Id,
                a.Action,
                a.EntityType,
                a.EntityDisplayName,
                a.UserName,
                a.Timestamp
            })
            .ToListAsync();

        return logs.Select(a => new RecentActivityItem
        {
            Id = a.Id,
            Action = a.Action.ToString(),
            EntityType = a.EntityType,
            EntityDisplayName = a.EntityDisplayName ?? string.Empty,
            UserName = a.UserName ?? "System",
            Timestamp = a.Timestamp
        }).ToList();
    }
}
