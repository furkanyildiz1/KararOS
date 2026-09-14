using FluentValidation;

namespace KararOS.Application.DTOs.Auth;

public class RegisterRequestValidator : AbstractValidator<RegisterRequestDto>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Email)
        .NotEmpty().WithMessage("E-posta adresi boş bırakılamaz.")
        .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
        .WithMessage("Geçerli ve standart bir e-posta adresi giriniz (örn: ornek@gmail.com).");

        RuleFor(x => x.Password)
        .NotEmpty().WithMessage("Şifre boş bırakılamaz.")
        .MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır");

        RuleFor(x => x.FullName)
        .NotEmpty().WithMessage("Ad soyad boş bırakılamaz")
        .MaximumLength(150).WithMessage("Ad soyad 150 karakterden uzun olamaz");

        RuleFor(x => x.IsTermsAccepted)
        .Equal(true).WithMessage("Kullanıcı sözleşmesini kabul etmelisiniz");

        RuleFor(x => x.IsKvkkAccepted)
        .Equal(true).WithMessage("KVKK aydınlatma metnini kabul etmelisiniz");
    }
}

public class LoginRequestValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email)
        .NotEmpty().WithMessage("E-posta adresi boş bırakılamaz.")
        .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");

        RuleFor(x => x.Password)
        .NotEmpty().WithMessage("Şifre gereklidir.");
    }
}