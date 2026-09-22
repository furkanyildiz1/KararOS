using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using KararOS.Application.DTOs.Auth;
using KararOS.Application.Services.Interfaces;
using KararOS.Application.Services;

namespace KararOS.Api.Controllers;

public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;
    private readonly IVerificationCodeService _verificationCodeService;
    private readonly IValidator<RegisterRequestDto> _registerValidator;
    private readonly IValidator<LoginRequestDto> _loginValidator;

    public AuthController(
        IAuthService authService,
        IVerificationCodeService verificationCodeService,
        IValidator<RegisterRequestDto> registerValidator,
        IValidator<LoginRequestDto> loginValidator)
    {
        _authService = authService;
        _verificationCodeService = verificationCodeService;
        _loginValidator = loginValidator;
        _registerValidator = registerValidator;
    }

    [HttpPost("send-verification-code")]
    public async Task<IActionResult> SendVerificationCode([FromBody] SendVerificationCodeRequestDto request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains("@"))
        {
            return BadRequest(new { message = "Lütfen geçerli bir e-posta adresi giriniz." });
        }

        await _verificationCodeService.GenerateAndSendCodeAsync(request.Email, ct);
        return Ok(new { message = "Doğrulama kodu e-posta adresinize gönderildi." });
    }

    [HttpPost("verify-code")]
    public IActionResult VerifyCode([FromBody] VerifyCodeRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Code))
        {
            return BadRequest(new { message = "E-posta ve doğrulama kodu gereklidir." });
        }

        var isValid = _verificationCodeService.VerifyCode(request.Email, request.Code);
        if (!isValid)
        {
            return BadRequest(new { message = "Girdiğiniz 6 haneli doğrulama kodu geçersiz veya süresi dolmuş." });
        }

        return Ok(new { success = true, message = "E-posta başarıyla doğrulandı." });
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto request, CancellationToken ct = default)
    {
        var validationResult = await _registerValidator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var ip = HttpContext.Connection?.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();

        var result = await _authService.RegisterAsync(request, ip, userAgent, ct);

        return Ok(result);
    }

    [HttpPost("login")]

    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request, CancellationToken ct = default)
    {
        var validationResult = await _loginValidator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var ip = HttpContext.Connection?.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();

        var result = await _authService.LoginAsync(request, ip, userAgent, ct);
        return Ok(result);
    }

    [HttpPost("social-login")]
    public async Task<ActionResult<AuthResponseDto>> SocialLogin([FromBody] SocialLoginRequestDto request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Provider))
        {
            return BadRequest(new { message = "Geçerli bir sağlayıcı (Google veya Apple) belirtilmelidir." });
        }

        var ip = HttpContext.Connection?.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();

        var result = await _authService.SocialLoginAsync(request, ip, userAgent, ct);
        return Ok(result);
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<AuthResponseDto>> RefreshToken([FromBody] RefreshTokenRequestDto request, CancellationToken ct = default)
    {
        var result = await _authService.RefreshTokenAsync(request, ct);
        return Ok(result);
    }

    [HttpPost("revoke-token")]
    public async Task<IActionResult> RevokeToken([FromBody] RefreshTokenRequestDto request, CancellationToken ct = default)
    {
        await _authService.RevokeTokenAsync(request.RefreshToken, ct);
        return NoContent();
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request, CancellationToken ct = default)
    {
        await _authService.ChangePasswordAsync(CurrentUserId, request, ct);
        return NoContent();
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpDelete("account")]
    public async Task<IActionResult> DeleteAccount(CancellationToken ct = default)
    {
        await _authService.DeleteAccountAsync(CurrentUserId, ct);
        return NoContent();
    }
}