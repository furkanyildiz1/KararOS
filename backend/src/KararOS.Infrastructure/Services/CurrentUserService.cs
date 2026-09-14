using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using KararOS.Application.Common.Interfaces;

namespace KararOS.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor; //bu http işlmei aktif http isteği ile ilglili bilglere
        //kullanıcya ve dorğulama bilgilerine erişmemişzi sağlar.
    }

    public Guid? UserId
    {
        get
        {
            var userIdStr = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) ??
            _httpContextAccessor.HttpContext?.User?.FindFirstValue("sub");

            return Guid.TryParse(userIdStr, out var userId) ? userId : null;
        }
    }

    public string? Email =>
    _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) ??
    _httpContextAccessor.HttpContext?.User?.FindFirstValue("email");
}
