using FluentValidation;
using Server.Features.Prescriptions.Models;
using Server.Features.Visits.Repositories;

namespace Server.Features.Prescriptions.Validators;

public class CreatePrescriptionItemValidator : AbstractValidator<CreatePrescriptionItemRequest>
{
    public CreatePrescriptionItemValidator()
    {
        RuleFor(x => x.MedicationName)
            .NotEmpty().WithMessage("Medication name is required.")
            .MaximumLength(300).WithMessage("Medication name must not exceed 300 characters.");

        RuleFor(x => x.Dosage)
            .MaximumLength(200).WithMessage("Dosage must not exceed 200 characters.");

        RuleFor(x => x.Frequency)
            .MaximumLength(200).WithMessage("Frequency must not exceed 200 characters.");

        RuleFor(x => x.Duration)
            .MaximumLength(200).WithMessage("Duration must not exceed 200 characters.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than zero.")
            .When(x => x.Quantity.HasValue);

        RuleFor(x => x.Instructions)
            .MaximumLength(500).WithMessage("Instructions must not exceed 500 characters.");
    }
}
