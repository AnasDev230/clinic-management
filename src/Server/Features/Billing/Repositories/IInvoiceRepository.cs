using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Repositories;

public interface IInvoiceRepository
{
    Task<Invoice?> GetByIdAsync(Guid id);

    Task<Invoice?> GetByIdForUpdateAsync(Guid id);

    Task<Invoice?> GetByInvoiceNumberAsync(string invoiceNumber);

    Task<(List<Invoice> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? patientId,
        Guid? doctorId,
        InvoiceStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo);

    Task<List<Invoice>> GetByPatientIdAsync(Guid patientId);

    Task<Invoice?> GetByVisitIdAsync(Guid visitId);

    Task<string> GetNextInvoiceNumberAsync(DateTime date);

    Task AddAsync(Invoice invoice);

    void Update(Invoice invoice);

    void SoftDelete(Invoice invoice);
}
