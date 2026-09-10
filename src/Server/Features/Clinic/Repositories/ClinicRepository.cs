using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Clinic.Repositories;

public class ClinicRepository : IClinicRepository
{
    private readonly AppDbContext _dbContext;

    public ClinicRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<ClinicProfile?> GetProfileReadOnlyAsync()
        => _dbContext.ClinicProfiles.AsNoTracking().FirstOrDefaultAsync();

    public Task<ClinicProfile?> GetProfileForUpdateAsync()
        => _dbContext.ClinicProfiles.FirstOrDefaultAsync();

    public Task<ClinicSettings?> GetSettingsReadOnlyAsync()
        => _dbContext.ClinicSettings.AsNoTracking().FirstOrDefaultAsync();

    public Task<ClinicSettings?> GetSettingsForUpdateAsync()
        => _dbContext.ClinicSettings.FirstOrDefaultAsync();

    public void AddProfile(ClinicProfile profile)
        => _dbContext.ClinicProfiles.Add(profile);

    public void AddSettings(ClinicSettings settings)
        => _dbContext.ClinicSettings.Add(settings);
}
