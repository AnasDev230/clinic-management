using FluentValidation;
using Server.Features.Prescriptions.Models;
using Server.Features.Visits.Repositories;

namespace Server.Features.Prescriptions.Validators;

public class CreatePrescriptionValidator : AbstractValidator<CreatePrescriptionRequest>
{
    public CreatePrescriptionValidator(IVisitRepository visitRepository)
    {
        RuleFor(x => x.VisitId)
            .NotEmpty().WithMessage("Visit is required.")
            .MustAsync(async (visitId, _) => await visitRepository.GetByIdAsync(visitId) is not null)
            .WithMessage("Visit not found.");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("At least one medication item is required.");

        RuleFor(x => x.ValidUntil)
            .Must(date => !date.HasValue || date.Value > DateTime.UtcNow)
            .WithMessage("Valid until must be in the future.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes must not exceed 1000 characters.");

        RuleForEach(x => x.Items).SetValidator(new CreatePrescriptionItemValidator());
    }
}
