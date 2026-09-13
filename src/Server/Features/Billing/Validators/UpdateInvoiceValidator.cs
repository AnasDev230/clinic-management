using FluentValidation;
using Server.Features.Billing.Models;

namespace Server.Features.Billing.Validators;

public class UpdateInvoiceValidator : AbstractValidator<UpdateInvoiceRequest>
{
    public UpdateInvoiceValidator()
    {
        RuleFor(x => x.DiscountPercentage)
            .InclusiveBetween(0, 100).WithMessage("Discount percentage must be between 0 and 100.");

        RuleFor(x => x.TaxPercentage)
            .InclusiveBetween(0, 100).WithMessage("Tax percentage must be between 0 and 100.");

        RuleFor(x => x.DueDate)
            .Must(date => !date.HasValue || date.Value > DateTime.UtcNow)
            .WithMessage("Due date must be in the future.");

        RuleFor(x => x.Notes)
            .MaximumLength(2000).WithMessage("Notes must not exceed 2000 characters.");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("At least one invoice item is required.");

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.ServiceName)
                .NotEmpty().WithMessage("Service name is required.")
                .MaximumLength(300).WithMessage("Service name must not exceed 300 characters.");

            item.RuleFor(i => i.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than zero.");

            item.RuleFor(i => i.UnitPrice)
                .GreaterThan(0).WithMessage("Unit price must be greater than zero.");

            item.RuleFor(i => i.DiscountAmount)
                .GreaterThanOrEqualTo(0).WithMessage("Discount amount must be zero or greater.");
        });
    }
}
