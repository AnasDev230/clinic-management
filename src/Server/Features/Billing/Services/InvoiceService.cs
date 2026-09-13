using Server.Core.Common;
using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Billing.Models;
using Server.Features.Billing.Repositories;
using Server.Features.Patients.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Services;

public class InvoiceService : IInvoiceService
{
    private readonly IInvoiceRepository _repository;
    private readonly IPatientRepository _patientRepository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public InvoiceService(
        IInvoiceRepository repository,
        IPatientRepository patientRepository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _patientRepository = patientRepository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<InvoiceResponse> CreateAsync(CreateInvoiceRequest request)
    {
        var patient = await _patientRepository.GetByIdAsync(request.PatientId);
        if (patient is null)
            throw new NotFoundException("Patient", request.PatientId);

        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var totals = CalculateTotals(
                request.Items.Select(i => (i.Quantity, i.UnitPrice, i.DiscountAmount)).ToList(),
                request.DiscountPercentage,
                request.TaxPercentage);

            var invoice = new Invoice
            {
                InvoiceNumber = await _repository.GetNextInvoiceNumberAsync(DateTime.UtcNow),
                PatientId = patient.Id,
                VisitId = request.VisitId,
                DoctorId = request.DoctorId,
                InvoiceDate = DateTime.UtcNow,
                DueDate = request.DueDate,
                Status = InvoiceStatus.Draft,
                SubTotal = totals.SubTotal,
                DiscountAmount = totals.DiscountAmount,
                DiscountPercentage = request.DiscountPercentage,
                TaxAmount = totals.TaxAmount,
                TaxPercentage = request.TaxPercentage,
                TotalAmount = totals.TotalAmount,
                PaidAmount = 0,
                RemainingAmount = 0,
                Notes = request.Notes?.Trim(),
                CreatedBy = _currentUserService.GetUserId()
            };

            await _repository.AddAsync(invoice);
            await _dbContext.SaveChangesAsync();

            var sortOrder = 0;
            foreach (var item in request.Items)
            {
                _dbContext.InvoiceItems.Add(new InvoiceItem
                {
                    InvoiceId = invoice.Id,
                    ServiceName = item.ServiceName.Trim(),
                    Description = item.Description?.Trim(),
                    MedicalServiceId = item.MedicalServiceId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    DiscountAmount = item.DiscountAmount,
                    TotalAmount = CalculateLineTotal(item.Quantity, item.UnitPrice, item.DiscountAmount),
                    SortOrder = sortOrder++,
                    CreatedBy = _currentUserService.GetUserId()
                });
            }

            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            var created = await _repository.GetByIdAsync(invoice.Id);
            return MapToResponse(created!);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<InvoiceResponse> UpdateAsync(Guid id, UpdateInvoiceRequest request)
    {
        var invoice = await _repository.GetByIdForUpdateAsync(id);
        if (invoice is null)
            throw new NotFoundException("Invoice", id);

        if (invoice.Status != InvoiceStatus.Draft)
            throw new BusinessException("Only draft invoices can be updated.");

        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var totals = CalculateTotals(
                request.Items.Select(i => (i.Quantity, i.UnitPrice, i.DiscountAmount)).ToList(),
                request.DiscountPercentage,
                request.TaxPercentage);

            invoice.DueDate = request.DueDate;
            invoice.DiscountPercentage = request.DiscountPercentage;
            invoice.TaxPercentage = request.TaxPercentage;
            invoice.Notes = request.Notes?.Trim();
            invoice.SubTotal = totals.SubTotal;
            invoice.DiscountAmount = totals.DiscountAmount;
            invoice.TaxAmount = totals.TaxAmount;
            invoice.TotalAmount = totals.TotalAmount;
            invoice.UpdatedBy = _currentUserService.GetUserId();

            var incomingIds = request.Items
                .Where(i => i.Id.HasValue)
                .Select(i => i.Id!.Value)
                .ToHashSet();

            var toRemove = invoice.Items
                .Where(i => !incomingIds.Contains(i.Id))
                .ToList();

            if (toRemove.Count > 0)
                _dbContext.InvoiceItems.RemoveRange(toRemove);

            var sortOrder = 0;
            foreach (var item in request.Items)
            {
                if (item.Id.HasValue)
                {
                    var existing = invoice.Items.FirstOrDefault(i => i.Id == item.Id.Value);
                    if (existing is not null)
                    {
                        existing.ServiceName = item.ServiceName.Trim();
                        existing.Description = item.Description?.Trim();
                        existing.MedicalServiceId = item.MedicalServiceId;
                        existing.Quantity = item.Quantity;
                        existing.UnitPrice = item.UnitPrice;
                        existing.DiscountAmount = item.DiscountAmount;
                        existing.TotalAmount = CalculateLineTotal(item.Quantity, item.UnitPrice, item.DiscountAmount);
                        existing.SortOrder = sortOrder++;
                        existing.UpdatedBy = _currentUserService.GetUserId();
                    }
                }
                else
                {
                    _dbContext.InvoiceItems.Add(new InvoiceItem
                    {
                        InvoiceId = invoice.Id,
                        ServiceName = item.ServiceName.Trim(),
                        Description = item.Description?.Trim(),
                        MedicalServiceId = item.MedicalServiceId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        DiscountAmount = item.DiscountAmount,
                        TotalAmount = CalculateLineTotal(item.Quantity, item.UnitPrice, item.DiscountAmount),
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

    public async Task<InvoiceResponse> IssueAsync(Guid id)
    {
        var invoice = await _repository.GetByIdForUpdateAsync(id);
        if (invoice is null)
            throw new NotFoundException("Invoice", id);

        if (invoice.Status != InvoiceStatus.Draft)
            throw new BusinessException("Only draft invoices can be issued.");

        invoice.Status = InvoiceStatus.Issued;
        invoice.IssuedAt = DateTime.UtcNow;
        invoice.IssuedBy = _currentUserService.GetUserId() ?? Guid.Empty;
        invoice.RemainingAmount = invoice.TotalAmount;
        invoice.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<InvoiceResponse> CancelAsync(Guid id)
    {
        var invoice = await _repository.GetByIdForUpdateAsync(id);
        if (invoice is null)
            throw new NotFoundException("Invoice", id);

        if (invoice.Status != InvoiceStatus.Draft &&
            invoice.Status != InvoiceStatus.Issued)
            throw new BusinessException("Only draft or issued invoices can be cancelled.");

        var hasActivePayments = invoice.Payments
            .Any(p => p.Status == PaymentStatus.Completed || p.Status == PaymentStatus.Pending);
        if (hasActivePayments)
            throw new BusinessException("Invoices with payments cannot be cancelled. Refund the payments first.");

        invoice.Status = InvoiceStatus.Cancelled;
        invoice.UpdatedBy = _currentUserService.GetUserId();

        await _dbContext.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(id);
        return MapToResponse(updated!);
    }

    public async Task<InvoiceResponse> GetByIdAsync(Guid id)
    {
        var invoice = await _repository.GetByIdAsync(id);
        if (invoice is null)
            throw new NotFoundException("Invoice", id);

        return MapToResponse(invoice);
    }

    public async Task<InvoiceResponse> GetByInvoiceNumberAsync(string invoiceNumber)
    {
        var invoice = await _repository.GetByInvoiceNumberAsync(invoiceNumber);
        if (invoice is null)
            throw new NotFoundException($"Invoice with number '{invoiceNumber}' was not found.");

        return MapToResponse(invoice);
    }

    public async Task<PagedResult<InvoiceListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? patientId,
        Guid? doctorId,
        InvoiceStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetAllAsync(
            page, pageSize, search, patientId, doctorId, status, dateFrom, dateTo);

        return new PagedResult<InvoiceListItemResponse>
        {
            Items = items.Select(MapToListItem).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<List<InvoiceListItemResponse>> GetByPatientIdAsync(Guid patientId)
    {
        var items = await _repository.GetByPatientIdAsync(patientId);
        return items.Select(MapToListItem).ToList();
    }

    public async Task<InvoiceSummaryResponse> GetSummaryAsync()
    {
        var (items, _) = await _repository.GetAllAsync(1, int.MaxValue, null, null, null, null, null, null);

        var active = items.Where(i => i.Status != InvoiceStatus.Cancelled).ToList();
        var overdue = items.Where(i => i.Status == InvoiceStatus.Overdue).ToList();

        return new InvoiceSummaryResponse
        {
            TotalInvoices = items.Count,
            TotalAmount = active.Sum(i => i.TotalAmount),
            TotalPaid = active.Sum(i => i.PaidAmount),
            TotalOutstanding = active.Sum(i => i.RemainingAmount),
            OverdueCount = overdue.Count,
            OverdueAmount = overdue.Sum(i => i.RemainingAmount)
        };
    }

    public async Task DeleteAsync(Guid id)
    {
        var invoice = await _repository.GetByIdForUpdateAsync(id);
        if (invoice is null)
            throw new NotFoundException("Invoice", id);

        if (invoice.Status != InvoiceStatus.Draft)
            throw new BusinessException("Only draft invoices can be deleted.");

        _repository.SoftDelete(invoice);
        await _dbContext.SaveChangesAsync();
    }

    private static decimal CalculateLineTotal(decimal quantity, decimal unitPrice, decimal discountAmount)
        => Math.Max(0, quantity * unitPrice - discountAmount);

    private static (decimal SubTotal, decimal DiscountAmount, decimal TaxAmount, decimal TotalAmount) CalculateTotals(
        List<(decimal Quantity, decimal UnitPrice, decimal DiscountAmount)> lines,
        decimal discountPercentage,
        decimal taxPercentage)
    {
        var subTotal = lines.Sum(l => CalculateLineTotal(l.Quantity, l.UnitPrice, l.DiscountAmount));
        var discountAmount = subTotal * discountPercentage / 100;
        var taxableBase = subTotal - discountAmount;
        var taxAmount = taxableBase * taxPercentage / 100;
        var totalAmount = taxableBase + taxAmount;

        return (subTotal, discountAmount, taxAmount, totalAmount);
    }

    private static string BuildPatientName(Invoice invoice)
        => invoice.Patient is null
            ? string.Empty
            : $"{invoice.Patient.FirstName} {invoice.Patient.LastName}".Trim();

    private static string BuildDoctorName(Invoice invoice)
        => invoice.Doctor is null
            ? string.Empty
            : $"{invoice.Doctor.FirstName} {invoice.Doctor.LastName}".Trim();

    private static InvoiceListItemResponse MapToListItem(Invoice invoice)
        => new()
        {
            Id = invoice.Id,
            InvoiceNumber = invoice.InvoiceNumber,
            PatientName = BuildPatientName(invoice),
            InvoiceDate = invoice.InvoiceDate,
            DueDate = invoice.DueDate,
            TotalAmount = invoice.TotalAmount,
            PaidAmount = invoice.PaidAmount,
            RemainingAmount = invoice.RemainingAmount,
            Status = invoice.Status
        };

    private static InvoiceResponse MapToResponse(Invoice invoice)
        => new()
        {
            Id = invoice.Id,
            InvoiceNumber = invoice.InvoiceNumber,
            PatientId = invoice.PatientId,
            PatientName = BuildPatientName(invoice),
            VisitId = invoice.VisitId,
            VisitDate = invoice.Visit?.VisitDate,
            DoctorId = invoice.DoctorId,
            DoctorName = BuildDoctorName(invoice),
            InvoiceDate = invoice.InvoiceDate,
            DueDate = invoice.DueDate,
            Status = invoice.Status,
            SubTotal = invoice.SubTotal,
            DiscountAmount = invoice.DiscountAmount,
            DiscountPercentage = invoice.DiscountPercentage,
            TaxAmount = invoice.TaxAmount,
            TaxPercentage = invoice.TaxPercentage,
            TotalAmount = invoice.TotalAmount,
            PaidAmount = invoice.PaidAmount,
            RemainingAmount = invoice.RemainingAmount,
            Notes = invoice.Notes,
            IssuedBy = invoice.IssuedBy,
            IssuedAt = invoice.IssuedAt,
            Items = invoice.Items
                .OrderBy(i => i.SortOrder)
                .Select(i => new InvoiceItemResponse
                {
                    Id = i.Id,
                    InvoiceId = i.InvoiceId,
                    ServiceName = i.ServiceName,
                    Description = i.Description,
                    MedicalServiceId = i.MedicalServiceId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    DiscountAmount = i.DiscountAmount,
                    TotalAmount = i.TotalAmount,
                    SortOrder = i.SortOrder,
                    CreatedAt = i.CreatedAt,
                    UpdatedAt = i.UpdatedAt
                }).ToList(),
            Payments = invoice.Payments
                .OrderByDescending(p => p.PaymentDate)
                .Select(p => new PaymentResponse
                {
                    Id = p.Id,
                    PaymentNumber = p.PaymentNumber,
                    InvoiceId = p.InvoiceId,
                    InvoiceNumber = invoice.InvoiceNumber,
                    PatientId = p.PatientId,
                    PatientName = BuildPatientName(invoice),
                    Amount = p.Amount,
                    PaymentMethod = p.PaymentMethod,
                    PaymentDate = p.PaymentDate,
                    ReferenceNumber = p.ReferenceNumber,
                    Notes = p.Notes,
                    ReceivedBy = p.ReceivedBy,
                    Status = p.Status,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                }).ToList(),
            CreatedAt = invoice.CreatedAt,
            UpdatedAt = invoice.UpdatedAt
        };
}
