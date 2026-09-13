using FluentValidation;
using Server.Features.LabTests.Models;

namespace Server.Features.LabTests.Validators;

public class UpdateLabTestValidator : AbstractValidator<UpdateLabTestRequest>
{
    public UpdateLabTestValidator()
    {
        RuleFor(x => x.TestName)
            .NotEmpty().WithMessage("Test name is required.")
            .MaximumLength(300).WithMessage("Test name must not exceed 300 characters.");

        RuleFor(x => x.TestCategory)
            .MaximumLength(200).WithMessage("Test category must not exceed 200 characters.");

        RuleFor(x => x.Priority)
            .IsInEnum().WithMessage("Invalid test priority.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid test status.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes must not exceed 1000 characters.");

        RuleForEach(x => x.Results).ChildRules(result =>
        {
            result.RuleFor(r => r.ParameterName)
                .NotEmpty().WithMessage("Parameter name is required.")
                .MaximumLength(200).WithMessage("Parameter name must not exceed 200 characters.");

            result.RuleFor(r => r.Value)
                .MaximumLength(100).WithMessage("Value must not exceed 100 characters.");

            result.RuleFor(r => r.Unit)
                .MaximumLength(50).WithMessage("Unit must not exceed 50 characters.");

            result.RuleFor(r => r.NormalRange)
                .MaximumLength(100).WithMessage("Normal range must not exceed 100 characters.");

            result.RuleFor(r => r.Notes)
                .MaximumLength(500).WithMessage("Notes must not exceed 500 characters.");
        });
    }
}
