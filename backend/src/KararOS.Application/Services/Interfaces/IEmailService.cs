namespace KararOS.Application.Services.Interfaces;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string toEmail, string code, CancellationToken ct = default);
}
