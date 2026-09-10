using FluentValidation;
using Server.Features.Specialties.Models;

namespace Server.Features.Specialties.Validators;

public class UpdateSpecialtyValidator : AbstractValidator<UpdateSpecialtyRequest>
{
    public UpdateSpecialtyValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Specialty name is required.")
            .MaximumLength(200).WithMessage("Specialty name must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Sort order must be zero or greater.");
    }
}
