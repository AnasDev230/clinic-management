using FluentValidation;
using Server.Features.Appointments.Models;

namespace Server.Features.Appointments.Validators;

public class CreateFollowUpValidator : AbstractValidator<CreateFollowUpRequest>
{
    public CreateFollowUpValidator()
    {
        RuleFor(x => x.FollowUpDate)
            .NotEmpty().WithMessage("Follow-up date is required.")
            .Must(date => date > DateTime.UtcNow)
            .WithMessage("Follow-up date must be in the future.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes must not exceed 1000 characters.");
    }
}
