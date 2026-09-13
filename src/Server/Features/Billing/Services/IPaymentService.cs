using Server.Core.Common;
using Server.Features.Billing.Models;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Services;

public interface IPaymentService
{
    Task<PaymentResponse> CreateAsync(CreatePaymentRequest request);

    Task<PaymentResponse> RefundAsync(Guid id);

    Task<PaymentResponse> GetByIdAsync(Guid id);

    Task<List<PaymentResponse>> GetByInvoiceIdAsync(Guid invoiceId);

    Task<PagedResult<PaymentListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? patientId,
        PaymentMethod? method,
        PaymentStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo);

    Task<List<PaymentListItemResponse>> GetByPatientIdAsync(Guid patientId);
}
