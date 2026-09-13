using FluentValidation;
using Server.Features.Services.Models;

namespace Server.Features.Services.Validators;

public class UpdateServiceCategoryValidator : AbstractValidator<UpdateServiceCategoryRequest>
{
    public UpdateServiceCategoryValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Category name is required.")
            .MaximumLength(200).WithMessage("Category name must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Sort order must be zero or greater.");
    }
}
