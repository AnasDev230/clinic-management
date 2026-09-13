using FluentValidation;
using Server.Features.LabTests.Models;

namespace Server.Features.LabTests.Validators;

public class CreateLabResultValidator : AbstractValidator<CreateLabResultRequest>
{
    public CreateLabResultValidator()
    {
        RuleFor(x => x.ParameterName)
            .NotEmpty().WithMessage("Parameter name is required.")
            .MaximumLength(200).WithMessage("Parameter name must not exceed 200 characters.");

        RuleFor(x => x.Value)
            .MaximumLength(100).WithMessage("Value must not exceed 100 characters.");

        RuleFor(x => x.Unit)
            .MaximumLength(50).WithMessage("Unit must not exceed 50 characters.");

        RuleFor(x => x.NormalRange)
            .MaximumLength(100).WithMessage("Normal range must not exceed 100 characters.");

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notes must not exceed 500 characters.");
    }
}
