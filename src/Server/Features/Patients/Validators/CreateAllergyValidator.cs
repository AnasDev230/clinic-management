using FluentValidation;
using Server.Features.Patients.Models;

namespace Server.Features.Patients.Validators;

public class CreateAllergyValidator : AbstractValidator<CreateAllergyRequest>
{
    public CreateAllergyValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Allergy name is required.")
            .MaximumLength(200).WithMessage("Allergy name must not exceed 200 characters.");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Allergy type is invalid.");

        RuleFor(x => x.Severity)
            .IsInEnum().WithMessage("Allergy severity is invalid.");

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notes must not exceed 500 characters.");
    }
}
