namespace Server.Infrastructure.Persistence.Entities.Enums;

public enum AuditAction
{
    Create = 0,
    Update = 1,
    Delete = 2,
    Login = 3,
    Logout = 4,
    FailedLogin = 5,
    StatusChange = 6,
    Payment = 7,
    Refund = 8,
    Print = 9,
    Export = 10
}
