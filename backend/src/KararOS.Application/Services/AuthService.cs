using Microsoft.EntityFrameworkCore;
using KararOS.Application.Common.Interfaces;
using KararOS.Application.DTOs.Auth;
using KararOS.Application.Services.Interfaces;
using KararOS.Domain.Entities;
using KararOS.Domain.Enums;
using System.Linq.Expressions;

namespace KararOS.Application.Services;

public class AuthService : IAuthService
{
    private const string CurrentLegalDocVersion = "v1.0";

    private readonly IKararDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IKararDbContext dbContext,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator
    )
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, string? ipAddress = null,
    string? userAgent = null, CancellationToken ct = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var exists = await _dbContext.Users.AnyAsync(u => u.Email == email, ct);
        if (exists)
        {
            throw new InvalidOperationException("BU e-posta adresi ile zaten kayıtlı bir hesap bulunmaktadır.");
        }

        var user = new User
        {
            Email = email,
            FullName = request.FullName.Trim(),
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            IsMarketingConsentAccepted = request.IsMarketingConsentAccepted
        };

        //yasl onayların kaydı

        if (request.IsTermsAccepted)
        {
            user.LegalAcceptances.Add(new LegalDocumentAcceptance
            {
                DocumentType = LegalDocumentType.TermsOfService,
                DocumentVersion = CurrentLegalDocVersion,
                AcceptedAt = DateTimeOffset.UtcNow,
                IpAddress = ipAddress,
                UserAgent = userAgent
            });
        }

        if (request.IsKvkkAccepted)
        {
            user.LegalAcceptances.Add(new LegalDocumentAcceptance
            {
                DocumentType = LegalDocumentType.KvkkConsent,
                DocumentVersion = CurrentLegalDocVersion,
                AcceptedAt = DateTimeOffset.UtcNow,
                IpAddress = ipAddress,
                UserAgent = userAgent
            });
        }
        if (request.IsMarketingConsentAccepted)
        {
            user.LegalAcceptances.Add(new LegalDocumentAcceptance
            {
                DocumentType = LegalDocumentType.PrivacyPolicy,
                DocumentVersion = CurrentLegalDocVersion,
                AcceptedAt = DateTimeOffset.UtcNow,
                IpAddress = ipAddress,
                UserAgent = userAgent
            });
        }

        //refresh token oluşurma

        var refreshTokenString = _jwtTokenGenerator.GenerateRefreshToken();
        var refreshToken = new RefreshToken
        {
            Token = refreshTokenString,
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(30)
        };

        user.RefreshTokens.Add(refreshToken);

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync(ct);

        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user);

        return new AuthResponseDto(
            AccessToken: accessToken,
            RefreshToken: refreshTokenString,
            ExpiresAt: DateTimeOffset.UtcNow.AddMinutes(15),
            User: new UserDto(user.Id, user.Email, user.FullName, HasBudgetProfile: false)
        );
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, string? ipAddress = null, string? userAgent = null, CancellationToken ct = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _dbContext.Users
        .Include(u => u.BudgetProfile)
        .Include(u => u.RefreshTokens)
        .FirstOrDefaultAsync(u => u.Email == email, ct);

        if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new InvalidOperationException("E-posta veya şifre hatalı.");
        }

        var refreshTokenString = _jwtTokenGenerator.GenerateRefreshToken();
        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshTokenString,
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(30)
        };

        _dbContext.RefreshTokens.Add(refreshToken);
        await _dbContext.SaveChangesAsync(ct);

        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user);
        return new AuthResponseDto(
            AccessToken: accessToken,
            RefreshToken: refreshTokenString,
            ExpiresAt: DateTimeOffset.UtcNow.AddMinutes(15),
            User: new UserDto(user.Id, user.Email, user.FullName, HasBudgetProfile: user.BudgetProfile != null)
        );
    }

    public async Task<AuthResponseDto> SocialLoginAsync(SocialLoginRequestDto request, string? ipAddress = null, string? userAgent = null, CancellationToken ct = default)
    {
        var provider = string.IsNullOrWhiteSpace(request.Provider) ? "Social" : request.Provider.Trim();
        var email = request.Email?.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(email))
        {
            if (!string.IsNullOrWhiteSpace(request.ProviderUserId))
            {
                email = $"{provider.ToLowerInvariant()}_{request.ProviderUserId}@kararos.social";
            }
            else
            {
                throw new InvalidOperationException("Sosyal giriş için e-posta veya kullanıcı kimliği gereklidir.");
            }
        }

        var user = await _dbContext.Users
            .Include(u => u.BudgetProfile)
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.Email == email, ct);

        if (user == null)
        {
            var displayName = !string.IsNullOrWhiteSpace(request.FullName)
                ? request.FullName.Trim()
                : $"{provider} Kullanıcısı";

            user = new User
            {
                Email = email,
                FullName = displayName,
                PasswordHash = _passwordHasher.HashPassword(Guid.NewGuid().ToString("N")),
                IsMarketingConsentAccepted = false
            };

            user.LegalAcceptances.Add(new LegalDocumentAcceptance
            {
                DocumentType = LegalDocumentType.TermsOfService,
                DocumentVersion = CurrentLegalDocVersion,
                AcceptedAt = DateTimeOffset.UtcNow,
                IpAddress = ipAddress,
                UserAgent = userAgent
            });

            user.LegalAcceptances.Add(new LegalDocumentAcceptance
            {
                DocumentType = LegalDocumentType.KvkkConsent,
                DocumentVersion = CurrentLegalDocVersion,
                AcceptedAt = DateTimeOffset.UtcNow,
                IpAddress = ipAddress,
                UserAgent = userAgent
            });

            _dbContext.Users.Add(user);
        }

        var refreshTokenString = _jwtTokenGenerator.GenerateRefreshToken();
        var refreshToken = new RefreshToken
        {
            Token = refreshTokenString,
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(30)
        };

        user.RefreshTokens.Add(refreshToken);
        await _dbContext.SaveChangesAsync(ct);

        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user);

        return new AuthResponseDto(
            AccessToken: accessToken,
            RefreshToken: refreshTokenString,
            ExpiresAt: DateTimeOffset.UtcNow.AddMinutes(15),
            User: new UserDto(user.Id, user.Email, user.FullName, HasBudgetProfile: user.BudgetProfile != null)
        );
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request, CancellationToken ct = default)
    {
        var token = await _dbContext.RefreshTokens.Include(r => r.User)
        .ThenInclude(u => u.BudgetProfile)
        .FirstOrDefaultAsync(r => r.Token == request.RefreshToken, ct);

        if (token == null || !token.IsActive)
        {
            throw new InvalidOperationException("Oturum süresi dolmuş veya geçersiz token.");
        }

        //eski tokeni iptal etme rotate
        token.IsRevoked = true;
        var newRefreshTokenString = _jwtTokenGenerator.GenerateRefreshToken();
        token.ReplacedByToken = newRefreshTokenString;

        var newRefreshToken = new RefreshToken
        {
            UserId = token.UserId,
            Token = newRefreshTokenString,
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(30)

        };

        _dbContext.RefreshTokens.Add(newRefreshToken);
        await _dbContext.SaveChangesAsync(ct);

        var newAccessToken = _jwtTokenGenerator.GenerateAccessToken(token.User);

        return new AuthResponseDto(
            AccessToken: newAccessToken,
            RefreshToken: newRefreshTokenString,
            ExpiresAt: DateTimeOffset.UtcNow.AddMinutes(15),
            User: new UserDto(token.User.Id, token.User.Email, token.User.FullName, HasBudgetProfile: token.User.BudgetProfile != null)
        );
    }

    public async Task RevokeTokenAsync(string token, CancellationToken ct = default)
    {
        var refreshToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(r => r.Token == token, ct);
        if (refreshToken != null && !refreshToken.IsRevoked)
        {
            refreshToken.IsRevoked = true;
            await _dbContext.SaveChangesAsync(ct);
        }
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request, CancellationToken ct = default)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user == null)
        {
            throw new InvalidOperationException("Kullanıcı bulunamadı.");
        }

        if (!_passwordHasher.VerifyPassword(request.CurrentPassword, user.PasswordHash))
        {
            throw new InvalidOperationException("Mevcut şifreniz hatalı. Lütfen kontrol edip tekrar deneyin.");
        }

        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
        {
            throw new InvalidOperationException("Yeni şifreniz en az 6 karakter olmalıdır.");
        }

        user.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        await _dbContext.SaveChangesAsync(ct);
    }

    public async Task<AuthResponseDto> ResetPasswordAsync(ResetPasswordRequestDto request, string? ipAddress = null, string? userAgent = null, CancellationToken ct = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _dbContext.Users
            .Include(u => u.BudgetProfile)
            .FirstOrDefaultAsync(u => u.Email == email, ct);
        if (user == null)
        {
            throw new InvalidOperationException("Bu e-posta adresine ait bir hesap bulunamadı.");
        }
        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
        {
            throw new InvalidOperationException("Yeni şifreniz en az 6 karakter olmalıdır.");
        }
        user.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        var refreshTokenString = _jwtTokenGenerator.GenerateRefreshToken();
        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshTokenString,
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(30)
        };
        _dbContext.RefreshTokens.Add(refreshToken);
        await _dbContext.SaveChangesAsync(ct);
        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user);
        return new AuthResponseDto(
            AccessToken: accessToken,
            RefreshToken: refreshTokenString,
            ExpiresAt: DateTimeOffset.UtcNow.AddMinutes(15),
            User: new UserDto(user.Id, user.Email, user.FullName, HasBudgetProfile: user.BudgetProfile != null)
        );
    }


    public async Task DeleteAccountAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _dbContext.Users
            .Include(u => u.BudgetProfile)
            .Include(u => u.SavingsGoals)
            .Include(u => u.DecisionRecords)
            .Include(u => u.LegalAcceptances)
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.Id == userId, ct);

        if (user == null)
        {
            throw new InvalidOperationException("Silinecek kullanıcı hesabı bulunamadı.");
        }

        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync(ct);
    }
}