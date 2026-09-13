using FluentValidation;
using Server.Features.Services.Models;
using Server.Features.Services.Repositories;

namespace Server.Features.Services.Validators;

public class CreateMedicalServiceValidator : AbstractValidator<CreateMedicalServiceRequest>
{
    public CreateMedicalServiceValidator(IMedicalServiceRepository repository)
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Service name is required.")
            .MaximumLength(300).WithMessage("Service name must not exceed 300 characters.")
            .MustAsync(async (name, _) => !await repository.ExistsByNameAsync(name))
            .WithMessage("A service with the same name already exists.");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters.");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Category is required.");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than zero.");

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0).WithMessage("Duration must be greater than zero.");

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Sort order must be zero or greater.");
    }
}
