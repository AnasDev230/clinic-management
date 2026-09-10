using FluentValidation;
using Server.Features.Clinic.Models;

namespace Server.Features.Clinic.Validators;

public class UpdateClinicProfileValidator : AbstractValidator<UpdateClinicProfileRequest>
{
    public UpdateClinicProfileValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Clinic name is required.")
            .MaximumLength(200).WithMessage("Clinic name must not exceed 200 characters.");

        RuleFor(x => x.Logo)
            .MaximumLength(500).WithMessage("Logo must not exceed 500 characters.");

        RuleFor(x => x.Address)
            .MaximumLength(500).WithMessage("Address must not exceed 500 characters.");

        RuleFor(x => x.City)
            .MaximumLength(100).WithMessage("City must not exceed 100 characters.");

        RuleFor(x => x.Phone)
            .MaximumLength(20).WithMessage("Phone must not exceed 20 characters.");

        RuleFor(x => x.Email)
            .MaximumLength(200).WithMessage("Email must not exceed 200 characters.")
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email))
            .WithMessage("Email format is invalid.");

        RuleFor(x => x.About)
            .MaximumLength(1000).WithMessage("About must not exceed 1000 characters.");

        RuleFor(x => x.WorkingHoursEnd)
            .GreaterThan(x => x.WorkingHoursStart)
            .WithMessage("Working hours end must be after working hours start.");
    }
}
