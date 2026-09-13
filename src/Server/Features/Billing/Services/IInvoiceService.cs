using Server.Core.Common;
using Server.Features.Billing.Models;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Services;

public interface IInvoiceService
{
    Task<InvoiceResponse> CreateAsync(CreateInvoiceRequest request);

    Task<InvoiceResponse> UpdateAsync(Guid id, UpdateInvoiceRequest request);

    Task<InvoiceResponse> IssueAsync(Guid id);

    Task<InvoiceResponse> CancelAsync(Guid id);

    Task<InvoiceResponse> GetByIdAsync(Guid id);

    Task<InvoiceResponse> GetByInvoiceNumberAsync(string invoiceNumber);

    Task<PagedResult<InvoiceListItemResponse>> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? patientId,
        Guid? doctorId,
        InvoiceStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo);

    Task<List<InvoiceListItemResponse>> GetByPatientIdAsync(Guid patientId);

    Task<InvoiceSummaryResponse> GetSummaryAsync();

    Task DeleteAsync(Guid id);
}
