using System.Security.Claims;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Server.Core.Common;
using Server.Infrastructure.Identity;
using Server.Infrastructure.Persistence.Entities;

namespace Server.Infrastructure.Persistence;

public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    public DbSet<ClinicProfile> ClinicProfiles => Set<ClinicProfile>();

    public DbSet<ClinicSettings> ClinicSettings => Set<ClinicSettings>();

    public DbSet<Specialty> Specialties => Set<Specialty>();

    public DbSet<Doctor> Doctors => Set<Doctor>();

    public DbSet<DoctorSpecialty> DoctorSpecialties => Set<DoctorSpecialty>();

    public DbSet<DoctorSchedule> DoctorSchedules => Set<DoctorSchedule>();

    public DbSet<Patient> Patients => Set<Patient>();

    public DbSet<PatientMedicalHistory> PatientMedicalHistories => Set<PatientMedicalHistory>();

    public DbSet<PatientAllergy> PatientAllergies => Set<PatientAllergy>();

    public DbSet<PatientInsurance> PatientInsurances => Set<PatientInsurance>();

    public DbSet<Appointment> Appointments => Set<Appointment>();

    public DbSet<FollowUp> FollowUps => Set<FollowUp>();

    public DbSet<Visit> Visits => Set<Visit>();

    public DbSet<VisitDiagnosis> VisitDiagnoses => Set<VisitDiagnosis>();

    public DbSet<VisitVitals> VisitVitals => Set<VisitVitals>();

    public DbSet<Prescription> Prescriptions => Set<Prescription>();

    public DbSet<PrescriptionItem> PrescriptionItems => Set<PrescriptionItem>();

    public DbSet<ServiceCategory> ServiceCategories => Set<ServiceCategory>();

    public DbSet<MedicalService> MedicalServices => Set<MedicalService>();

    public DbSet<LabTest> LabTests => Set<LabTest>();

    public DbSet<LabResult> LabResults => Set<LabResult>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        ApplySoftDeleteFilters(builder);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        AddAuditEntries();
        ApplyAuditRules();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void AddAuditEntries()
    {
        // Placeholder for future audit-log integration.
        // Audit rules (timestamps + soft delete) are applied in ApplyAuditRules().
    }

    private void ApplyAuditRules()
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity &&
                   e.State is EntityState.Added or EntityState.Modified or EntityState.Deleted);

        foreach (var entry in entries)
        {
            if (entry.Entity is BaseEntity entity)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entity.CreatedAt = DateTime.UtcNow;
                        break;
                    case EntityState.Modified:
                        entity.UpdatedAt = DateTime.UtcNow;
                        break;
                    case EntityState.Deleted:
                        entry.State = EntityState.Modified;
                        entity.DeletedAt = DateTime.UtcNow;
                        break;
                }
            }
        }
    }

    private static void ApplySoftDeleteFilters(ModelBuilder builder)
    {
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                var method = typeof(AppDbContext)
                    .GetMethod(nameof(SetSoftDeleteFilter),
                        System.Reflection.BindingFlags.NonPublic |
                        System.Reflection.BindingFlags.Static)!
                    .MakeGenericMethod(entityType.ClrType);

                method.Invoke(null, [builder]);
            }
        }
    }

    private static void SetSoftDeleteFilter<T>(ModelBuilder builder) where T : BaseEntity
    {
        builder.Entity<T>().HasQueryFilter(e => e.DeletedAt == null);
    }
}
