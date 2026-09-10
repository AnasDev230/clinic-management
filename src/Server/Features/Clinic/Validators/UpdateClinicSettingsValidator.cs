using FluentValidation;
using Server.Features.Clinic.Models;

namespace Server.Features.Clinic.Validators;

public class UpdateClinicSettingsValidator : AbstractValidator<UpdateClinicSettingsRequest>
{
    public UpdateClinicSettingsValidator()
    {
        RuleFor(x => x.CurrencyCode)
            .NotEmpty().WithMessage("Currency code is required.")
            .Length(3).WithMessage("Currency code must be exactly 3 characters (e.g. SYP).");

        RuleFor(x => x.TimeZone)
            .NotEmpty().WithMessage("Time zone is required.")
            .MaximumLength(100).WithMessage("Time zone must not exceed 100 characters.");

        RuleFor(x => x.AppointmentDurationMinutes)
            .GreaterThan(0).WithMessage("Appointment duration must be greater than zero.")
            .LessThanOrEqualTo(480).WithMessage("Appointment duration must not exceed 480 minutes.");

        RuleFor(x => x.MaxPatientsPerDay)
            .GreaterThan(0).WithMessage("Max patients per day must be greater than zero.")
            .LessThanOrEqualTo(1000).WithMessage("Max patients per day must not exceed 1000.");
    }
}
