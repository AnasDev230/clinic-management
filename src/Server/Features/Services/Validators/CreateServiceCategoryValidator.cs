using FluentValidation;
using Server.Features.Services.Models;
using Server.Features.Services.Repositories;

namespace Server.Features.Services.Validators;

public class CreateServiceCategoryValidator : AbstractValidator<CreateServiceCategoryRequest>
{
    public CreateServiceCategoryValidator(IServiceCategoryRepository repository)
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Category name is required.")
            .MaximumLength(200).WithMessage("Category name must not exceed 200 characters.")
            .MustAsync(async (name, _) => !await repository.ExistsByNameAsync(name))
            .WithMessage("A category with the same name already exists.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Sort order must be zero or greater.");
    }
}
