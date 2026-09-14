using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace KararOS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected Guid CurrentUserId
    {
        get
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (Guid.TryParse(userIdStr, out var id))
            {
                return id;
            }
            throw new UnauthorizedAccessException("Geçersiz veya eksik kullanıcı kimliği.");
        }
    }
}