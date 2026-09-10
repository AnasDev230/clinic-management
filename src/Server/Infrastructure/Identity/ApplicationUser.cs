using Microsoft.AspNetCore.Identity;

namespace Server.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public string? FullName { get; set; }
}
