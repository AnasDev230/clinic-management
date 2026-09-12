using FluentValidation;
using Server.Features.Patients.Models;

namespace Server.Features.Patients.Validators;

public class CreateInsuranceValidator : AbstractValidator<CreateInsuranceRequest>
{
    public CreateInsuranceValidator()
    {
        RuleFor(x => x.ProviderName)
            .NotEmpty().WithMessage("Provider name is required.")
            .MaximumLength(200).WithMessage("Provider name must not exceed 200 characters.");

        RuleFor(x => x.PolicyNumber)
            .NotEmpty().WithMessage("Policy number is required.")
            .MaximumLength(100).WithMessage("Policy number must not exceed 100 characters.");

        RuleFor(x => x.GroupNumber)
            .MaximumLength(100).WithMessage("Group number must not exceed 100 characters.");

        RuleFor(x => x.ExpiryDate)
            .NotEmpty().WithMessage("Expiry date is required.");

        RuleFor(x => x.CoveragePercentage)
            .InclusiveBetween(0, 100).WithMessage("Coverage percentage must be between 0 and 100.");
    }
}
