using Server.Features.Auth.Models;

namespace Server.Features.Auth.Services;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);

    Task<TokenResponse> RefreshTokenAsync(RefreshTokenRequest request);

    Task LogoutAsync(RefreshTokenRequest request);
}
