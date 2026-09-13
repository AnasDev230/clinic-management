using FluentValidation;
using Server.Features.Visits.Models;

namespace Server.Features.Visits.Validators;

public class CreateVisitValidator : AbstractValidator<CreateVisitRequest>
{
    public CreateVisitValidator()
    {
        RuleFor(x => x.AppointmentId)
            .NotEmpty().WithMessage("Appointment is required.");

        RuleFor(x => x.ChiefComplaint)
            .MaximumLength(1000).WithMessage("Chief complaint must not exceed 1000 characters.");

        RuleFor(x => x.Symptoms)
            .MaximumLength(2000).WithMessage("Symptoms must not exceed 2000 characters.");

        RuleFor(x => x.Notes)
            .MaximumLength(2000).WithMessage("Notes must not exceed 2000 characters.");
    }
}
