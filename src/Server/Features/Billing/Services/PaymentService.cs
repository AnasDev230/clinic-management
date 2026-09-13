using Server.Core.Common;
using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Billing.Models;
using Server.Features.Billing.Repositories;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _repository;
    private readonly IInvoiceRepository _invoiceRepository;
    private readonly AppDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public PaymentService(
        IPaymentRepository repository,
        IInvoiceRepository invoiceRepository,
        AppDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _invoiceRepository = invoiceRepository;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<PaymentResponse> CreateAsync(CreatePaymentRequest request)
    {
        var invoice = await _invoiceRepository.GetByIdForUpdateAsync(request.InvoiceId);
        if (invoice is null)
            throw new NotFoundException("Invoice", request.InvoiceId);

        if (invoice.Status != InvoiceStatus.Issued &&
            invoice.Status != InvoiceStatus.PartiallyPaid)
            throw new BusinessException("Payment can only be recorded for an issued or partially paid invoice.");

        if (request.Amount > invoice.RemainingAmount)
            throw new BusinessException("Payment amount cannot exceed the remaining balance.");

        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var payment = new Payment
            {
                PaymentNumber = await _repository.GetNextPaymentNumberAsync(DateTime.UtcNow),
                InvoiceId = invoice.Id,
                PatientId = invoice.PatientId,
                Amount = request.Amount,
                PaymentMethod = request.PaymentMethod,
                PaymentDate = DateTime.UtcNow,
                ReferenceNumber = request.ReferenceNumber?.Trim(),
                Notes = request.Notes?.Trim(),
                ReceivedBy = _currentUserService.GetUserId() ?? Guid.Empty,
                Status = PaymentStatus.Completed,
                CreatedBy = _currentUserService.GetUserId()
            };

            await _repository.AddAsync(payment);

            invoice.PaidAmount += request.Amount;
            invoice.RemainingAmount -= request.Amount;
            invoice.Status = invoice.RemainingAmount == 0
                ? InvoiceStatus.Paid
                : InvoiceStatus.PartiallyPaid;
            invoice.UpdatedBy = _currentUserService.GetUserId();

            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            var created = await _repository.GetByIdAsync(payment.Id);
            return MapToResponse(created!);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<PaymentResponse> RefundAsync(Guid id)
    {
        var payment = await _repository.GetByIdForUpdateAsync(id);
        if (payment is null)
            throw new NotFoundException("Payment", id);

        if (payment.Status != PaymentStatus.Completed)
            throw new BusinessException("Only completed payments can be refunded.");

        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            payment.Status = PaymentStatus.Refunded;
            payment.UpdatedBy = _currentUserService.GetUserId();

            var invoice = await _invoiceRepository.GetByIdForUpdateAsync(payment.InvoiceId);
            if (invoice is not null &&
                invoice.Status != InvoiceStatus.Cancelled)
            {
                invoice.PaidAmount -= payment.Amount;
                invoice.RemainingAmount += payment.Amount;
                invoice.Status = invoice.PaidAmount == 0
                    ? InvoiceStatus.Issued
                    : InvoiceStatus.PartiallyPaid;
                invoice.UpdatedBy = _currentUserService.GetUserId();
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

    public async Task<PaymentResponse> GetByIdAsync(Guid id)
    {
        var payment = await _repository.GetByIdAsync(id);
        if (payment is null)
            throw new NotFoundException("Payment", id);

        return MapToResponse(payment);
    }

    public async Task<List<PaymentResponse>> GetByInvoiceIdAsync(Guid invoiceId)
    {
        var items = await _repository.GetByInvoiceIdAsync(invoiceId);
        return items.Select(MapToResponse).ToList();
    }

    public async Task<PagedResult<PaymentListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? patientId,
        PaymentMethod? method,
        PaymentStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _repository.GetAllAsync(
            page, pageSize, search, patientId, method, status, dateFrom, dateTo);

        return new PagedResult<PaymentListItemResponse>
        {
            Items = items.Select(MapToListItem).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<List<PaymentListItemResponse>> GetByPatientIdAsync(Guid patientId)
    {
        var items = await _repository.GetByPatientIdAsync(patientId);
        return items.Select(MapToListItem).ToList();
    }

    private static string BuildPatientName(Payment payment)
        => payment.Patient is null
            ? string.Empty
            : $"{payment.Patient.FirstName} {payment.Patient.LastName}".Trim();

    private static PaymentListItemResponse MapToListItem(Payment payment)
        => new()
        {
            Id = payment.Id,
            PaymentNumber = payment.PaymentNumber,
            PatientName = BuildPatientName(payment),
            InvoiceNumber = payment.Invoice?.InvoiceNumber ?? string.Empty,
            Amount = payment.Amount,
            PaymentMethod = payment.PaymentMethod,
            PaymentDate = payment.PaymentDate,
            Status = payment.Status
        };

    private static PaymentResponse MapToResponse(Payment payment)
        => new()
        {
            Id = payment.Id,
            PaymentNumber = payment.PaymentNumber,
            InvoiceId = payment.InvoiceId,
            InvoiceNumber = payment.Invoice?.InvoiceNumber ?? string.Empty,
            PatientId = payment.PatientId,
            PatientName = BuildPatientName(payment),
            Amount = payment.Amount,
            PaymentMethod = payment.PaymentMethod,
            PaymentDate = payment.PaymentDate,
            ReferenceNumber = payment.ReferenceNumber,
            Notes = payment.Notes,
            ReceivedBy = payment.ReceivedBy,
            Status = payment.Status,
            CreatedAt = payment.CreatedAt,
            UpdatedAt = payment.UpdatedAt
        };
}
