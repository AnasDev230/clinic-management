using FluentValidation;
using Server.Features.Visits.Models;

namespace Server.Features.Visits.Validators;

public class CreateDiagnosisValidator : AbstractValidator<CreateDiagnosisRequest>
{
    public CreateDiagnosisValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Diagnosis name is required.")
            .MaximumLength(300).WithMessage("Diagnosis name must not exceed 300 characters.");

        RuleFor(x => x.Code)
            .MaximumLength(20).WithMessage("Code must not exceed 20 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters.");
    }
}
