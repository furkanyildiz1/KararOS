namespace KararOS.Application.Services.Interfaces;

public interface IVerificationCodeService
{
    Task<string> GenerateAndSendCodeAsync(string email, CancellationToken ct = default);
    bool VerifyCode(string email, string code);
}
