using FluentValidation;
using Server.Features.Patients.Models;

namespace Server.Features.Patients.Validators;

public class CreateMedicalHistoryValidator : AbstractValidator<CreateMedicalHistoryRequest>
{
    public CreateMedicalHistoryValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Status is invalid.");
    }
}
