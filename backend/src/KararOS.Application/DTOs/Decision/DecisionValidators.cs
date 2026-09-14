using FluentValidation;

namespace KararOS.Application.DTOs.Decision;

public class EvaluateDecisionRequestValidator : AbstractValidator<EvaluateDecisionRequestDto>
{
    public EvaluateDecisionRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Harcama başlığı boş bırakılamaz.")
            .MaximumLength(200).WithMessage("Başlık en fazla 200 karakter olabilir.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Harcama tutarı 0'dan büyük olmalıdır.");

        RuleFor(x => x.PlannedDate)
            .NotEmpty().WithMessage("Tarih boş bırakılamaz.");
    }
}

public class CreateDecisionRecordValidator : AbstractValidator<CreateDecisionRecordRequestDto>
{
    public CreateDecisionRecordValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Harcama başlığı boş bırakılamaz.")
            .MaximumLength(200).WithMessage("Başlık en fazla 200 karakter olabilir.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Harcama tutarı 0'dan büyük olmalıdır.");

        RuleFor(x => x.PlannedDate)
            .NotEmpty().WithMessage("Tarih boş bırakılamaz.");
    }
}

public class UpdateDecisionActionValidator : AbstractValidator<UpdateDecisionActionRequestDto>
{
    public UpdateDecisionActionValidator()
    {
        RuleFor(x => x.Action)
            .IsInEnum().WithMessage("Geçersiz aksiyon türü.");
    }
}
