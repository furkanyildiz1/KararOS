using System.Collections.Concurrent;
using System.Security.Cryptography;
using KararOS.Application.Services.Interfaces;

namespace KararOS.Application.Services;

public class VerificationCodeService : IVerificationCodeService
{
    private readonly IEmailService _emailService;
    private static readonly ConcurrentDictionary<string, VerificationEntry> _codes = new();
    private static readonly TimeSpan ExpirationTime = TimeSpan.FromMinutes(5);

    public VerificationCodeService(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public async Task<string> GenerateAndSendCodeAsync(string email, CancellationToken ct = default)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        // 6 haneli güvenli rastgele sayı üret
        var codeNumber = RandomNumberGenerator.GetInt32(100000, 1000000);
        var code = codeNumber.ToString();

        var entry = new VerificationEntry(code, DateTime.UtcNow.Add(ExpirationTime));
        _codes[normalizedEmail] = entry;

        // E-postayı gerçek SMTP servisi üzerinden ilet
        await _emailService.SendVerificationEmailAsync(normalizedEmail, code, ct);

        return code;
    }

    public bool VerifyCode(string email, string code)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        if (!_codes.TryGetValue(normalizedEmail, out var entry))
        {
            return false;
        }

        if (DateTime.UtcNow > entry.ExpiresAt)
        {
            _codes.TryRemove(normalizedEmail, out _);
            return false;
        }

        if (entry.Code == code.Trim())
        {
            _codes.TryRemove(normalizedEmail, out _);
            return true;
        }

        return false;
    }

    private record VerificationEntry(string Code, DateTime ExpiresAt);
}
