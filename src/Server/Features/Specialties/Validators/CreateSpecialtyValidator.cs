using FluentValidation;
using Server.Features.Specialties.Models;
using Server.Features.Specialties.Repositories;

namespace Server.Features.Specialties.Validators;

public class CreateSpecialtyValidator : AbstractValidator<CreateSpecialtyRequest>
{
    public CreateSpecialtyValidator(ISpecialtyRepository repository)
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Specialty name is required.")
            .MaximumLength(200).WithMessage("Specialty name must not exceed 200 characters.")
            .MustAsync(async (name, _) => !await repository.ExistsWithNameAsync(name))
            .WithMessage("A specialty with the same name already exists.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Sort order must be zero or greater.");
    }
}
