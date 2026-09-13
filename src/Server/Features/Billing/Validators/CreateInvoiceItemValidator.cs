using FluentValidation;
using Server.Features.Billing.Models;

namespace Server.Features.Billing.Validators;

public class CreateInvoiceItemValidator : AbstractValidator<CreateInvoiceItemRequest>
{
    public CreateInvoiceItemValidator()
    {
        RuleFor(x => x.ServiceName)
            .NotEmpty().WithMessage("Service name is required.")
            .MaximumLength(300).WithMessage("Service name must not exceed 300 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than zero.");

        RuleFor(x => x.UnitPrice)
            .GreaterThan(0).WithMessage("Unit price must be greater than zero.");

        RuleFor(x => x.DiscountAmount)
            .GreaterThanOrEqualTo(0).WithMessage("Discount amount must be zero or greater.");
    }
}
