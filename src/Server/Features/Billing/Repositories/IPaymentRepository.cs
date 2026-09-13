using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Repositories;

public interface IPaymentRepository
{
    Task<Payment?> GetByIdAsync(Guid id);

    Task<Payment?> GetByIdForUpdateAsync(Guid id);

    Task<List<Payment>> GetByInvoiceIdAsync(Guid invoiceId);

    Task<(List<Payment> Items, int TotalCount)> GetAllAsync(
        int page,
        int pageSize,
        string? search,
        Guid? patientId,
        PaymentMethod? method,
        PaymentStatus? status,
        DateTime? dateFrom,
        DateTime? dateTo);

    Task<List<Payment>> GetByPatientIdAsync(Guid patientId);

    Task<string> GetNextPaymentNumberAsync(DateTime date);

    Task<decimal> GetTotalPaidByInvoiceAsync(Guid invoiceId);

    Task AddAsync(Payment payment);

    void Update(Payment payment);
}
