using FluentValidation;
using Server.Features.Appointments.Models;

namespace Server.Features.Appointments.Validators;

public class CancelAppointmentValidator : AbstractValidator<CancelAppointmentRequest>
{
    public CancelAppointmentValidator()
    {
        RuleFor(x => x.CancellationReason)
            .NotEmpty().WithMessage("Cancellation reason is required.")
            .MaximumLength(500).WithMessage("Cancellation reason must not exceed 500 characters.");
    }
}
