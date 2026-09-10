using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Server.Core.Exceptions;
using Server.Core.Interfaces;
using Server.Features.Auth.Models;
using Server.Infrastructure.Identity;
using Server.Infrastructure.Options;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Auth.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly AppDbContext _dbContext;
    private readonly JwtSettings _jwtSettings;
    private readonly ICurrentUserService _currentUserService;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        AppDbContext dbContext,
        IOptions<JwtSettings> jwtOptions,
        ICurrentUserService currentUserService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _dbContext = dbContext;
        _jwtSettings = jwtOptions.Value;
        _currentUserService = currentUserService;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
            throw new BusinessException("Invalid email or password.");

        var signInResult = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
        if (!signInResult.Succeeded)
            throw new BusinessException("Invalid email or password.");

        var roles = await _userManager.GetRolesAsync(user);
        var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpiryMinutes);
        var accessToken = GenerateAccessToken(user, roles, expiresAt);
        var refreshToken = await CreateRefreshTokenAsync(user.Id);

        await _dbContext.SaveChangesAsync();

        return new LoginResponse
        {
            UserId = user.Id,
            Email = user.Email ?? string.Empty,
            FullName = user.FullName,
            Roles = roles.ToList(),
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token,
            ExpiresAt = expiresAt
        };
    }

    public async Task<TokenResponse> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var storedToken = await _dbContext.RefreshTokens
            .Include(t => t.ApplicationUser)
            .FirstOrDefaultAsync(t => t.Token == request.RefreshToken);

        if (storedToken is null || storedToken.IsRevoked || storedToken.ExpiresAt <= DateTime.UtcNow)
            throw new BusinessException("Invalid or expired refresh token.");

        if (storedToken.ApplicationUser is null)
            throw new BusinessException("Invalid refresh token.");

        // Rotation: revoke the old token and issue a new pair.
        storedToken.IsRevoked = true;
        storedToken.UpdatedAt = DateTime.UtcNow;
        storedToken.UpdatedBy = storedToken.ApplicationUserId;

        var roles = await _userManager.GetRolesAsync(storedToken.ApplicationUser);
        var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpiryMinutes);
        var accessToken = GenerateAccessToken(storedToken.ApplicationUser, roles, expiresAt);
        var newRefreshToken = await CreateRefreshTokenAsync(storedToken.ApplicationUserId);

        await _dbContext.SaveChangesAsync();

        return new TokenResponse
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken.Token,
            ExpiresAt = expiresAt
        };
    }

    public async Task LogoutAsync(RefreshTokenRequest request)
    {
        var userId = _currentUserService.GetUserId();
        if (userId is null)
            throw new UnauthorizedAccessException("Unauthorized access.");

        var storedToken = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == request.RefreshToken);

        if (storedToken is null || storedToken.ApplicationUserId != userId)
            throw new BusinessException("Invalid refresh token.");

        if (!storedToken.IsRevoked)
        {
            storedToken.IsRevoked = true;
            storedToken.UpdatedAt = DateTime.UtcNow;
            storedToken.UpdatedBy = userId;
            await _dbContext.SaveChangesAsync();
        }
    }

    private string GenerateAccessToken(ApplicationUser user, IList<string> roles, DateTime expiresAt)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        if (!string.IsNullOrWhiteSpace(user.Email))
        {
            claims.Add(new Claim(ClaimTypes.Email, user.Email));
            claims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email));
        }

        if (!string.IsNullOrWhiteSpace(user.UserName))
            claims.Add(new Claim(ClaimTypes.Name, user.UserName));

        foreach (var role in roles)
            claims.Add(new Claim(ClaimTypes.Role, role));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<RefreshToken> CreateRefreshTokenAsync(Guid userId)
    {
        string tokenValue;
        do
        {
            tokenValue = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        } while (await _dbContext.RefreshTokens.AnyAsync(t => t.Token == tokenValue));

        var refreshToken = new RefreshToken
        {
            Token = tokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryDays),
            IsRevoked = false,
            ApplicationUserId = userId,
            CreatedBy = userId
        };

        _dbContext.RefreshTokens.Add(refreshToken);
        return refreshToken;
    }
}
