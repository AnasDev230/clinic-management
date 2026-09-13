using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Repositories;

public class InvoiceRepository : IInvoiceRepository
{
    private readonly AppDbContext _dbContext;

    public InvoiceRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<Invoice?> GetByIdAsync(Guid id)
        => WithDetails().AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);

    public Task<Invoice?> GetByIdForUpdateAsync(Guid id)
        => WithDetails().FirstOrDefaultAsync(i => i.Id == id);

    public Task<Invoice?> GetByInvoiceNumberAsync(string invoiceNumber)
        => WithDetails().AsNoTracking().FirstOrDefaultAsync(i => i.InvoiceNumber == invoiceNumber);

    public async Task<(List<Invoice> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? patientId,
        Guid? doctorId,
        InvoiceStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo)
    {
        var query = WithDetails().AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(i =>
                i.InvoiceNumber.ToLower().Contains(term) ||
                (i.Notes != null && i.Notes.ToLower().Contains(term)) ||
                (i.Patient != null && (i.Patient.FirstName.ToLower().Contains(term) ||
                    i.Patient.LastName.ToLower().Contains(term) ||
                    i.Patient.Phone.ToLower().Contains(term))) ||
                (i.Doctor != null && (i.Doctor.FirstName.ToLower().Contains(term) ||
                    i.Doctor.LastName.ToLower().Contains(term))));
        }

        if (patientId.HasValue)
            query = query.Where(i => i.PatientId == patientId.Value);

        if (doctorId.HasValue)
            query = query.Where(i => i.DoctorId == doctorId.Value);

        if (status.HasValue)
            query = query.Where(i => i.Status == status.Value);

        if (dateFrom.HasValue)
            query = query.Where(i => i.InvoiceDate >= dateFrom.Value.Date);

        if (dateTo.HasValue)
            query = query.Where(i => i.InvoiceDate < dateTo.Value.Date.AddDays(1));

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(i => i.InvoiceDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public Task<List<Invoice>> GetByPatientIdAsync(Guid patientId)
        => WithDetails()
            .AsNoTracking()
            .Where(i => i.PatientId == patientId)
            .OrderByDescending(i => i.InvoiceDate)
            .ToListAsync();

    public Task<Invoice?> GetByVisitIdAsync(Guid visitId)
        => WithDetails()
            .AsNoTracking()
            .Where(i => i.VisitId == visitId)
            .OrderByDescending(i => i.InvoiceDate)
            .FirstOrDefaultAsync();

    public async Task<string> GetNextInvoiceNumberAsync(DateTime date)
    {
        var dayStart = date.Date;
        var dayEnd = dayStart.AddDays(1);

        var count = await _dbContext.Invoices
            .AsNoTracking()
            .CountAsync(i => i.InvoiceDate >= dayStart && i.InvoiceDate < dayEnd);

        return $"INV-{dayStart:yyyyMMdd}-{(count + 1):D4}";
    }

    public async Task AddAsync(Invoice invoice)
    {
        await _dbContext.Invoices.AddAsync(invoice);
    }

    public void Update(Invoice invoice)
        => _dbContext.Invoices.Update(invoice);

    public void SoftDelete(Invoice invoice)
        => _dbContext.Invoices.Remove(invoice);

    private IQueryable<Invoice> WithDetails()
        => _dbContext.Invoices
            .Include(i => i.Patient)
            .Include(i => i.Doctor)
            .Include(i => i.Visit)
            .Include(i => i.Items.OrderBy(item => item.SortOrder))
            .Include(i => i.Payments.OrderByDescending(p => p.PaymentDate));
}
