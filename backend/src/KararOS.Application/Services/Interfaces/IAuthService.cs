using KararOS.Application.DTOs.Auth;
namespace KararOS.Application.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, string? ipAddress = null, string? userAgent = null,
    CancellationToken ct = default);

    Task<AuthResponseDto> LoginAsync(LoginRequestDto request, string? ipAddress = null, string? userAgent = null,
    CancellationToken ct = default);

    Task<AuthResponseDto> SocialLoginAsync(SocialLoginRequestDto request, string? ipAddress = null, string? userAgent = null,
    CancellationToken ct = default);

    Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request,
    CancellationToken ct = default);

    Task RevokeTokenAsync(string token, CancellationToken ct = default);

    Task ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request, CancellationToken ct = default);

    Task DeleteAccountAsync(Guid userId, CancellationToken ct = default);
}