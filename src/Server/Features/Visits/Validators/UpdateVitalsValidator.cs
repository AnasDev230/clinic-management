using FluentValidation;
using Server.Features.Visits.Models;

namespace Server.Features.Visits.Validators;

public class UpdateVitalsValidator : AbstractValidator<UpdateVitalsRequest>
{
    public UpdateVitalsValidator()
    {
        RuleFor(x => x.Temperature)
            .InclusiveBetween(30, 45).When(x => x.Temperature.HasValue)
            .WithMessage("Temperature must be between 30 and 45.");

        RuleFor(x => x.BloodPressureSystolic)
            .InclusiveBetween(50, 300).When(x => x.BloodPressureSystolic.HasValue)
            .WithMessage("Systolic pressure must be between 50 and 300.");

        RuleFor(x => x.BloodPressureDiastolic)
            .InclusiveBetween(30, 200).When(x => x.BloodPressureDiastolic.HasValue)
            .WithMessage("Diastolic pressure must be between 30 and 200.");

        RuleFor(x => x.HeartRate)
            .InclusiveBetween(20, 300).When(x => x.HeartRate.HasValue)
            .WithMessage("Heart rate must be between 20 and 300.");

        RuleFor(x => x.RespiratoryRate)
            .InclusiveBetween(5, 80).When(x => x.RespiratoryRate.HasValue)
            .WithMessage("Respiratory rate must be between 5 and 80.");

        RuleFor(x => x.OxygenSaturation)
            .InclusiveBetween(0, 100).When(x => x.OxygenSaturation.HasValue)
            .WithMessage("Oxygen saturation must be between 0 and 100.");

        RuleFor(x => x.Weight)
            .InclusiveBetween(1, 500).When(x => x.Weight.HasValue)
            .WithMessage("Weight must be between 1 and 500.");

        RuleFor(x => x.Height)
            .InclusiveBetween(30, 250).When(x => x.Height.HasValue)
            .WithMessage("Height must be between 30 and 250.");

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notes must not exceed 500 characters.");
    }
}
