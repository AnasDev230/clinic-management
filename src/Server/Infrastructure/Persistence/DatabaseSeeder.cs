using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Identity;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence;

public static class DatabaseSeeder
{
    private static readonly string[] Roles = ["SuperAdmin", "Admin", "Doctor", "Receptionist"];

    public static async Task SeedAsync(IServiceProvider serviceProvider, IConfiguration configuration)
    {
        using var scope = serviceProvider.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        foreach (var roleName in Roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new ApplicationRole { Name = roleName });
            }
        }

        var adminEmail = configuration["DefaultAdmin:Email"] ?? "admin@clinic.local";
        var adminPassword = configuration["DefaultAdmin:Password"] ?? "Admin@123456";

        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
        if (existingAdmin is null)
        {
            var admin = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FullName = "Super Admin"
            };

            var result = await userManager.CreateAsync(admin, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "SuperAdmin");
            }
            else
            {
                throw new InvalidOperationException(
                    $"Failed to seed default SuperAdmin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }

        await SeedClinicDefaultsAsync(scope.ServiceProvider);
    }

    private static async Task SeedClinicDefaultsAsync(IServiceProvider serviceProvider)
    {
        var dbContext = serviceProvider.GetRequiredService<AppDbContext>();

        if (!await dbContext.ClinicProfiles.AnyAsync())
        {
            dbContext.ClinicProfiles.Add(new ClinicProfile
            {
                Name = "My Clinic",
                WorkingHoursStart = new TimeOnly(9, 0),
                WorkingHoursEnd = new TimeOnly(21, 0)
            });
        }

        if (!await dbContext.ClinicSettings.AnyAsync())
        {
            dbContext.ClinicSettings.Add(new ClinicSettings
            {
                CurrencyCode = "SYP",
                TimeZone = "Asia/Damascus",
                AllowOnlineBooking = true,
                AppointmentDurationMinutes = 30,
                MaxPatientsPerDay = 50
            });
        }

        await dbContext.SaveChangesAsync();
    }
}
