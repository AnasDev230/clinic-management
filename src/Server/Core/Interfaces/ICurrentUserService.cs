using System.Security.Claims;

namespace Server.Core.Interfaces;

public interface ICurrentUserService
{
    Guid? GetUserId();
    string? GetUserEmail();
}
