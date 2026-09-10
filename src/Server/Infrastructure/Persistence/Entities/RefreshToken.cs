using Server.Core.Common;
using Server.Infrastructure.Identity;

namespace Server.Infrastructure.Persistence.Entities;

public class RefreshToken : BaseEntity
{
    public string Token { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public bool IsRevoked { get; set; }

    public Guid ApplicationUserId { get; set; }

    public ApplicationUser? ApplicationUser { get; set; }
}
