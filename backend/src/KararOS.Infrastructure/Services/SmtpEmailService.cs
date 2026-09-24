using System.Net;
using System.Net.Mail;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using KararOS.Application.Services.Interfaces;

namespace KararOS.Infrastructure.Services;

public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmtpEmailService> _logger;
    private static readonly HttpClient _httpClient = new() { Timeout = TimeSpan.FromSeconds(5) };

    public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendVerificationEmailAsync(string toEmail, string code, CancellationToken ct = default)
    {
        var htmlBody = $@"
<!DOCTYPE html>
<html lang=""tr"">
<head>
    <meta charset=""UTF-8"">
    <title>KararOS Güvenlik Doğrulama Kodu</title>
</head>
<body style=""margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"">
    <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""background-color:#f8fafc; padding: 40px 10px;"">
        <tr>
            <td align=""center"">
                <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""max-width: 520px; background-color:#ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05);"">
                    <tr>
                        <td align=""center"" style=""padding: 35px 30px 20px 30px; background-color:#0f172a;"">
                            <h1 style=""color:#ffffff; margin:0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;"">Karar<span style=""color:#10b981;"">OS</span></h1>
                            <p style=""color:#94a3b8; margin: 6px 0 0 0; font-size: 13px;"">Bilinçli Harcama & Karar Destek Platformu</p>
                        </td>
                    </tr>
                    <tr>
                        <td style=""padding: 35px 30px;"">
                            <h2 style=""color:#0f172a; margin:0 0 12px 0; font-size: 20px; font-weight: 700;"">Güvenlik Doğrulama Kodunuz</h2>
                            <p style=""color:#475569; font-size: 14px; line-height: 22px; margin: 0 0 24px 0;"">
                                KararOS hesabınız için talep edilen 6 haneli güvenlik doğrulama kodunuz aşağıdadır:
                            </p>
                            
                            <div align=""center"" style=""margin: 25px 0;"">
                                <div style=""background: #ecfdf5; border: 2px dashed #10b981; border-radius: 14px; padding: 18px 24px; display: inline-block;"">
                                    <span style=""font-size: 34px; font-weight: 800; color: #065f46; letter-spacing: 10px; margin-left: 10px;"">{code}</span>
                                </div>
                            </div>

                            <p style=""color:#64748b; font-size: 12.5px; line-height: 18px; margin: 20px 0 0 0; text-align: center;"">
                                ⏱️ Bu kod <strong>5 dakika</strong> boyunca geçerlidir. Bu işlemi siz yapmadıysanız güvenliğiniz için şifrenizi kontrol ediniz.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align=""center"" style=""padding: 20px; background-color:#f8fafc; border-top: 1px solid #f1f5f9;"">
                            <p style=""color:#94a3b8; font-size: 11.5px; margin: 0;"">
                                &copy; {DateTime.UtcNow.Year} KararOS. Tüm hakları saklıdır.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";

        // Geliştirme, canlı izleme ve loglama
        _logger.LogInformation("==================================================");
        _logger.LogInformation("🔐 [KARAROS SECURITY OTP] Kime: {Email} | KOD: {Code}", toEmail, code);
        _logger.LogInformation("==================================================");

        // 1. YÖNTEM: Resend HTTP API (Port 443 - Bulut ve Render için en hızlı ve güvenli yol)
        var resendApiKey = _configuration["Resend:ApiKey"] ?? _configuration["SmtpSettings:ResendApiKey"] ?? Environment.GetEnvironmentVariable("RESEND_API_KEY");
        if (!string.IsNullOrWhiteSpace(resendApiKey))
        {
            try
            {
                var payload = new
                {
                    from = _configuration["SmtpSettings:SenderEmail"] ?? "KararOS <onboarding@resend.dev>",
                    to = new[] { toEmail },
                    subject = $"{code} - KararOS Doğrulama Kodunuz",
                    html = htmlBody
                };

                using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails")
                {
                    Headers = { { "Authorization", $"Bearer {resendApiKey}" } },
                    Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
                };

                var res = await _httpClient.SendAsync(requestMessage, ct);
                if (res.IsSuccessStatusCode)
                {
                    _logger.LogInformation("✅ E-posta Resend HTTP API üzerinden {Email} adresine başarıyla teslim edildi.", toEmail);
                    return;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Resend API ile e-posta gönderilemedi, fallback deneniyor: {Message}", ex.Message);
            }
        }

        // 2. YÖNTEM: Standart SMTP (Port 587 - Gmail vb.)
        var host = _configuration["SmtpSettings:Host"] ?? "smtp.gmail.com";
        var port = int.TryParse(_configuration["SmtpSettings:Port"], out var p) ? p : 587;
        var enableSsl = !bool.TryParse(_configuration["SmtpSettings:EnableSsl"], out var ssl) || ssl;
        var senderEmail = _configuration["SmtpSettings:SenderEmail"] ?? "noreply.kararos@gmail.com";
        var senderName = _configuration["SmtpSettings:SenderName"] ?? "KararOS";
        var username = _configuration["SmtpSettings:Username"] ?? "";
        var password = _configuration["SmtpSettings:Password"] ?? "";

        if (!string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(password))
        {
            try
            {
                using var client = new SmtpClient(host, port)
                {
                    Credentials = new NetworkCredential(username, password),
                    EnableSsl = enableSsl,
                    Timeout = 4000
                };

                using var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, senderName),
                    Subject = $"{code} - KararOS Doğrulama Kodunuz",
                    Body = htmlBody,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(toEmail);

                await client.SendMailAsync(mailMessage, ct);
                _logger.LogInformation("✅ E-posta SMTP üzerinden {Email} adresine başarıyla teslim edildi.", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ SMTP e-posta gönderimi sırasında hata oluştu: {Message}", ex.Message);
            }
        }
    }
}

