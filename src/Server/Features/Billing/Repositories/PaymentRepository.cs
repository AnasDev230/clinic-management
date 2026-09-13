using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly AppDbContext _dbContext;

    public PaymentRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Payment?> GetByIdAsync(Guid id)
        => WithDetails().AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

    public Task<Payment?> GetByIdForUpdateAsync(Guid id)
        => WithDetails().FirstOrDefaultAsync(p => p.Id == id);

    public Task<List<Payment>> GetByInvoiceIdAsync(Guid invoiceId)
        => WithDetails()
            .AsNoTracking()
            .Where(p => p.InvoiceId == invoiceId)
            .OrderByDescending(p => p.PaymentDate)
            .ToListAsync();

    public async Task<(List<Payment> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? patientId,
        PaymentMethod? method,
        PaymentStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo)
    {
        var query = WithDetails().AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p =>
                p.PaymentNumber.ToLower().Contains(term) ||
                (p.ReferenceNumber != null && p.ReferenceNumber.ToLower().Contains(term)) ||
                (p.Notes != null && p.Notes.ToLower().Contains(term)) ||
                (p.Invoice != null && p.Invoice.InvoiceNumber.ToLower().Contains(term)) ||
                (p.Patient != null && (p.Patient.FirstName.ToLower().Contains(term) ||
                    p.Patient.LastName.ToLower().Contains(term) ||
                    p.Patient.Phone.ToLower().Contains(term))));
        }

        if (patientId.HasValue)
            query = query.Where(p => p.PatientId == patientId.Value);

        if (method.HasValue)
            query = query.Where(p => p.PaymentMethod == method.Value);

        if (status.HasValue)
            query = query.Where(p => p.Status == status.Value);

        if (dateFrom.HasValue)
            query = query.Where(p => p.PaymentDate >= dateFrom.Value.Date);

        if (dateTo.HasValue)
            query = query.Where(p => p.PaymentDate < dateTo.Value.Date.AddDays(1));

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(p => p.PaymentDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public Task<List<Payment>> GetByPatientIdAsync(Guid patientId)
        => WithDetails()
            .AsNoTracking()
            .Where(p => p.PatientId == patientId)
            .OrderByDescending(p => p.PaymentDate)
            .ToListAsync();

    public async Task<string> GetNextPaymentNumberAsync(DateTime date)
    {
        var dayStart = date.Date;
        var dayEnd = dayStart.AddDays(1);

        var count = await _dbContext.Payments
            .AsNoTracking()
            .CountAsync(p => p.PaymentDate >= dayStart && p.PaymentDate < dayEnd);

        return $"PAY-{dayStart:yyyyMMdd}-{(count + 1):D4}";
    }

    public Task<decimal> GetTotalPaidByInvoiceAsync(Guid invoiceId)
        => _dbContext.Payments
            .AsNoTracking()
            .Where(p => p.InvoiceId == invoiceId && p.Status == PaymentStatus.Completed)
            .SumAsync(p => p.Amount);

    public async Task AddAsync(Payment payment)
    {
        await _dbContext.Payments.AddAsync(payment);
    }

    public void Update(Payment payment)
        => _dbContext.Payments.Update(payment);

    private IQueryable<Payment> WithDetails()
        => _dbContext.Payments
            .Include(p => p.Invoice)
            .Include(p => p.Patient);
}
