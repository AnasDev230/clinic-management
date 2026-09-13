using FluentValidation;
using Server.Features.Appointments.Models;

namespace Server.Features.Appointments.Validators;

public class UpdateFollowUpValidator : AbstractValidator<UpdateFollowUpRequest>
{
    public UpdateFollowUpValidator()
    {
        RuleFor(x => x.FollowUpDate)
            .NotEmpty().WithMessage("Follow-up date is required.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes must not exceed 1000 characters.");
    }
}
