using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Persistence;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Features.Appointments.Repositories;

public class FollowUpRepository : IFollowUpRepository
{
    private readonly AppDbContext _dbContext;

    public FollowUpRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<List<FollowUp>> GetByAppointmentIdAsync(Guid appointmentId)
        => _dbContext.FollowUps
            .AsNoTracking()
            .Where(f => f.AppointmentId == appointmentId)
            .OrderBy(f => f.FollowUpDate)
            .ToListAsync();

    public Task<FollowUp?> GetByIdAsync(Guid id)
        => _dbContext.FollowUps
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.Id == id);

    public Task<FollowUp?> GetByIdForUpdateAsync(Guid id)
        => _dbContext.FollowUps
            .FirstOrDefaultAsync(f => f.Id == id);

    public async Task AddAsync(FollowUp followUp)
    {
        await _dbContext.FollowUps.AddAsync(followUp);
    }

    public void Update(FollowUp followUp)
        => _dbContext.FollowUps.Update(followUp);

    public void SoftDelete(FollowUp followUp)
        => _dbContext.FollowUps.Remove(followUp);
}
