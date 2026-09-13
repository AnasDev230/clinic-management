using FluentValidation;
using Server.Features.Billing.Models;
using Server.Features.Patients.Repositories;

namespace Server.Features.Billing.Validators;

public class CreateInvoiceValidator : AbstractValidator<CreateInvoiceRequest>
{
    public CreateInvoiceValidator(IPatientRepository patientRepository)
    {
        RuleFor(x => x.PatientId)
            .NotEmpty().WithMessage("Patient is required.")
            .MustAsync(async (patientId, _) => await patientRepository.GetByIdAsync(patientId) is not null)
            .WithMessage("Patient not found.");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("At least one invoice item is required.");

        RuleFor(x => x.DiscountPercentage)
            .InclusiveBetween(0, 100).WithMessage("Discount percentage must be between 0 and 100.");

        RuleFor(x => x.TaxPercentage)
            .InclusiveBetween(0, 100).WithMessage("Tax percentage must be between 0 and 100.");

        RuleFor(x => x.DueDate)
            .Must(date => !date.HasValue || date.Value > DateTime.UtcNow)
            .WithMessage("Due date must be in the future.");

        RuleFor(x => x.Notes)
            .MaximumLength(2000).WithMessage("Notes must not exceed 2000 characters.");

        RuleForEach(x => x.Items).SetValidator(new CreateInvoiceItemValidator());
    }
}
