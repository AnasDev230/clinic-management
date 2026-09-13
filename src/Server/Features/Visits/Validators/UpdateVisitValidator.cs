using FluentValidation;
using Server.Features.Visits.Models;

namespace Server.Features.Visits.Validators;

public class UpdateVisitValidator : AbstractValidator<UpdateVisitRequest>
{
    public UpdateVisitValidator()
    {
        RuleFor(x => x.ChiefComplaint)
            .MaximumLength(1000).WithMessage("Chief complaint must not exceed 1000 characters.");

        RuleFor(x => x.Symptoms)
            .MaximumLength(2000).WithMessage("Symptoms must not exceed 2000 characters.");

        RuleFor(x => x.Diagnosis)
            .MaximumLength(2000).WithMessage("Diagnosis must not exceed 2000 characters.");

        RuleFor(x => x.TreatmentPlan)
            .MaximumLength(2000).WithMessage("Treatment plan must not exceed 2000 characters.");

        RuleFor(x => x.Notes)
            .MaximumLength(2000).WithMessage("Notes must not exceed 2000 characters.");

        RuleFor(x => x.NextVisitNotes)
            .MaximumLength(500).WithMessage("Next visit notes must not exceed 500 characters.");

        RuleFor(x => x.TotalAmount)
            .GreaterThanOrEqualTo(0).WithMessage("Total amount must be zero or greater.");

        RuleFor(x => x.DiscountAmount)
            .GreaterThanOrEqualTo(0).WithMessage("Discount amount must be zero or greater.")
            .LessThanOrEqualTo(x => x.TotalAmount).WithMessage("Discount amount must not exceed total amount.");
    }
}
