using FluentValidation;
using Server.Features.LabTests.Models;
using Server.Features.Visits.Repositories;

namespace Server.Features.LabTests.Validators;

public class CreateLabTestValidator : AbstractValidator<CreateLabTestRequest>
{
    public CreateLabTestValidator(IVisitRepository visitRepository)
    {
        RuleFor(x => x.VisitId)
            .NotEmpty().WithMessage("Visit is required.")
            .MustAsync(async (visitId, _) => await visitRepository.GetByIdAsync(visitId) is not null)
            .WithMessage("Visit not found.");

        RuleFor(x => x.TestName)
            .NotEmpty().WithMessage("Test name is required.")
            .MaximumLength(300).WithMessage("Test name must not exceed 300 characters.");

        RuleFor(x => x.TestCategory)
            .MaximumLength(200).WithMessage("Test category must not exceed 200 characters.");

        RuleFor(x => x.Priority)
            .IsInEnum().WithMessage("Invalid test priority.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes must not exceed 1000 characters.");

        RuleForEach(x => x.Results).SetValidator(new CreateLabResultValidator());
    }
}
