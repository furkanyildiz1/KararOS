namespace KararOS.Application.DTOs.Auth;

public record RegisterRequestDto(
    string Email,
    string Password,
    string FullName,
    bool IsMarketingConsentAccepted,
    bool IsTermsAccepted,
    bool IsKvkkAccepted
);

public record LoginRequestDto(
    string Email,
    string Password
);

public record RefreshTokenRequestDto(
    string RefreshToken
);

public record AuthResponseDto(
    string AccessToken,
    string RefreshToken,
    DateTimeOffset ExpiresAt,
    UserDto User
);

public record UserDto(
    Guid Id,
    string Email,
    string FullName,
    bool HasBudgetProfile
);

public record ChangePasswordRequestDto(
    string CurrentPassword,
    string NewPassword
);

public record SendVerificationCodeRequestDto(
    string Email
);

public record VerifyCodeRequestDto(
    string Email,
    string Code
);