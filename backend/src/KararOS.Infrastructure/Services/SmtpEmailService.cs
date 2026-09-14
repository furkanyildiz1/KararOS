using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using KararOS.Application.Services.Interfaces;

namespace KararOS.Infrastructure.Services;

public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendVerificationEmailAsync(string toEmail, string code, CancellationToken ct = default)
    {
        var host = _configuration["SmtpSettings:Host"] ?? "smtp.gmail.com";
        var port = int.TryParse(_configuration["SmtpSettings:Port"], out var p) ? p : 587;
        var enableSsl = !bool.TryParse(_configuration["SmtpSettings:EnableSsl"], out var ssl) || ssl;
        var senderEmail = _configuration["SmtpSettings:SenderEmail"] ?? "noreply.kararos@gmail.com";
        var senderName = _configuration["SmtpSettings:SenderName"] ?? "KararOS";
        var username = _configuration["SmtpSettings:Username"] ?? "";
        var password = _configuration["SmtpSettings:Password"] ?? "";

        var htmlBody = $@"
<!DOCTYPE html>
<html lang=""tr"">
<head>
    <meta charset=""UTF-8"">
    <title>KararOS E-Posta Doğrulama</title>
</head>
<body style=""margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"">
    <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""background-color:#f8fafc; padding: 40px 10px;"">
        <tr>
            <td align=""center"">
                <table width=""100%"" border=""0"" cellspacing=""0"" cellpadding=""0"" style=""max-width: 520px; background-color:#ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05);"">
                    <!-- Üst Başlık -->
                    <tr>
                        <td align=""center"" style=""padding: 35px 30px 20px 30px; background-color:#0f172a;"">
                            <h1 style=""color:#ffffff; margin:0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;"">Karar<span style=""color:#10b981;"">OS</span></h1>
                            <p style=""color:#94a3b8; margin: 6px 0 0 0; font-size: 13px;"">Bilinçli Harcama & Karar Destek Platformu</p>
                        </td>
                    </tr>
                    <!-- İçerik -->
                    <tr>
                        <td style=""padding: 35px 30px;"">
                            <h2 style=""color:#0f172a; margin:0 0 12px 0; font-size: 20px; font-weight: 700;"">E-Posta Adresinizi Doğrulayın</h2>
                            <p style=""color:#475569; font-size: 14px; line-height: 22px; margin: 0 0 24px 0;"">
                                KararOS hesabınızı oluşturmak için aşağıdaki 6 haneli güvenlik kodunu uygulamadaki ilgili alana giriniz:
                            </p>
                            
                            <!-- Kod Kutusu -->
                            <div align=""center"" style=""margin: 25px 0;"">
                                <div style=""background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 14px; padding: 18px 24px; display: inline-block;"">
                                    <span style=""font-size: 32px; font-weight: 800; color: #0f172a; letter-spacing: 10px; margin-left: 10px;"">{code}</span>
                                </div>
                            </div>

                            <p style=""color:#64748b; font-size: 12.5px; line-height: 18px; margin: 20px 0 0 0; text-align: center;"">
                                ⏱️ Bu kod <strong>5 dakika</strong> boyunca geçerlidir. Eğer bu işlemi siz başlatmadıysanız bu e-postayı dikkate almayınız.
                            </p>
                        </td>
                    </tr>
                    <!-- Alt Bilgi -->
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

        // Konsol / Log çıktısı (Geliştirme ortamı ve izleme için)
        _logger.LogInformation("==================================================");
        _logger.LogInformation("📧 [KARAROS EMAIL SEND] Kime: {Email} | KOD: {Code}", toEmail, code);
        _logger.LogInformation("==================================================");

        // SMTP bilgileri yapılandırılmışsa gerçek e-postayı ilet
        if (!string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(password))
        {
            try
            {
                using var client = new SmtpClient(host, port)
                {
                    Credentials = new NetworkCredential(username, password),
                    EnableSsl = enableSsl,
                    Timeout = 10000
                };

                using var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, senderName),
                    Subject = $"{code} - KararOS E-Posta Doğrulama Kodunuz",
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
        else
        {
            _logger.LogWarning("⚠️ SmtpSettings:Username veya SmtpSettings:Password belirtilmediği için e-posta konsola yazıldı. Gerçek gönderim için appsettings.json dosyasındaki SmtpSettings alanına Gmail/SMTP bilgilerinizi giriniz.");
        }
    }
}
