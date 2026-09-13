using FluentValidation;
using Server.Features.Billing.Models;
using Server.Features.Billing.Repositories;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Features.Billing.Validators;

public class CreatePaymentValidator : AbstractValidator<CreatePaymentRequest>
{
    public CreatePaymentValidator(IInvoiceRepository invoiceRepository)
    {
        RuleFor(x => x.InvoiceId)
            .NotEmpty().WithMessage("Invoice is required.")
            .MustAsync(async (invoiceId, _) => await invoiceRepository.GetByIdAsync(invoiceId) is not null)
            .WithMessage("Invoice not found.")
            .MustAsync(async (invoiceId, _) =>
            {
                var invoice = await invoiceRepository.GetByIdAsync(invoiceId);
                return invoice is not null &&
                    (invoice.Status == InvoiceStatus.Issued ||
                     invoice.Status == InvoiceStatus.PartiallyPaid);
            })
            .WithMessage("Payment can only be recorded for an issued or partially paid invoice.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than zero.");

        RuleFor(x => x.PaymentMethod)
            .IsInEnum().WithMessage("Invalid payment method.");

        RuleFor(x => x.ReferenceNumber)
            .MaximumLength(100).WithMessage("Reference number must not exceed 100 characters.");

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notes must not exceed 500 characters.");
    }
}
