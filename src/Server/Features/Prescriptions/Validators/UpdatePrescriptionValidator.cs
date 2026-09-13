using FluentValidation;
using Server.Features.Prescriptions.Models;

namespace Server.Features.Prescriptions.Validators;

public class UpdatePrescriptionValidator : AbstractValidator<UpdatePrescriptionRequest>
{
    public UpdatePrescriptionValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid prescription status.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes must not exceed 1000 characters.");

        RuleFor(x => x.ValidUntil)
            .Must(date => !date.HasValue || date.Value > DateTime.UtcNow)
            .WithMessage("Valid until must be in the future.");

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.MedicationName)
                .NotEmpty().WithMessage("Medication name is required.")
                .MaximumLength(300).WithMessage("Medication name must not exceed 300 characters.");

            item.RuleFor(i => i.Dosage)
                .MaximumLength(200).WithMessage("Dosage must not exceed 200 characters.");

            item.RuleFor(i => i.Frequency)
                .MaximumLength(200).WithMessage("Frequency must not exceed 200 characters.");

            item.RuleFor(i => i.Duration)
                .MaximumLength(200).WithMessage("Duration must not exceed 200 characters.");

            item.RuleFor(i => i.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than zero.")
                .When(i => i.Quantity.HasValue);

            item.RuleFor(i => i.Instructions)
                .MaximumLength(500).WithMessage("Instructions must not exceed 500 characters.");
        });
    }
}
