using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Infrastructure.Identity;
using Server.Infrastructure.Persistence.Entities;
using Server.Infrastructure.Persistence.Entities.Enums;

namespace Server.Infrastructure.Persistence.DemoSeed;

/// <summary>
/// Large development-only data seed covering every business table.
/// Runs only when explicitly enabled via configuration and only on an
/// empty database (presence of any patient skips the whole seed).
/// Uses a fixed random seed so all developer machines get identical data.
/// Attachments and live refresh tokens are intentionally skipped.
/// </summary>
public static class DemoDataSeeder
{
    private const int DoctorCount = 10;
    private const int PatientCount = 200;
    private const int AppointmentCount = 800;

    public static async Task SeedDemoAsync(IServiceProvider serviceProvider, Microsoft.Extensions.Configuration.IConfiguration configuration)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        if (await dbContext.Patients.AnyAsync())
            return;

        var random = new Random(42);
        var today = DateTime.UtcNow.Date;

        var adminEmail = configuration["DefaultAdmin:Email"] ?? "admin@clinic.local";
        var superAdmin = await userManager.FindByEmailAsync(adminEmail)
            ?? await userManager.Users.FirstOrDefaultAsync()
            ?? throw new InvalidOperationException("Demo seed requires at least one Identity user (run DatabaseSeeder first).");
        var superAdminId = superAdmin.Id;

        var specialties = await SeedSpecialtiesAsync(dbContext);
        var doctors = await SeedDoctorsAsync(dbContext, userManager, specialties, random);
        var patients = await SeedPatientsAsync(dbContext, random, today);
        var services = await SeedMedicalServicesAsync(dbContext);
        var appointments = await SeedAppointmentsAsync(dbContext, doctors, patients, random, today);
        var visits = await SeedVisitsAsync(dbContext, appointments, random);
        await SeedPrescriptionsAsync(dbContext, visits, random);
        await SeedLabTestsAsync(dbContext, visits, random);
        var invoices = await SeedInvoicesAsync(dbContext, visits, services, superAdminId, random);
        await SeedPaymentsAsync(dbContext, invoices, superAdminId, random);
        await SeedFollowUpsAsync(dbContext, visits, random);
        await SeedNotificationsAsync(dbContext, superAdminId, invoices, random, today);
        await SeedAuditLogsAsync(dbContext, superAdmin, patients, doctors, invoices, random, today);
    }

    private static async Task<List<Specialty>> SeedSpecialtiesAsync(AppDbContext db)
    {
        var list = DemoData.Specialties
            .Select((name, i) => new Specialty { Name = name, SortOrder = i })
            .ToList();
        db.Specialties.AddRange(list);
        await db.SaveChangesAsync();
        return list;
    }

    private static async Task<List<Doctor>> SeedDoctorsAsync(
        AppDbContext db,
        UserManager<ApplicationUser> userManager,
        List<Specialty> specialties,
        Random random)
    {
        var doctors = new List<Doctor>();
        for (var i = 0; i < DoctorCount; i++)
        {
            var male = i % 2 == 0;
            var firstName = male
                ? DemoData.MaleFirstNames[i % DemoData.MaleFirstNames.Length]
                : DemoData.FemaleFirstNames[i % DemoData.FemaleFirstNames.Length];
            var lastName = DemoData.LastNames[(i * 3 + 1) % DemoData.LastNames.Length];
            var email = $"doctor{i + 1}@example.com";

            // FK-holder accounts only (unique index on Doctor.ApplicationUserId).
            // Random unknown passwords — these accounts are NOT for logging in.
            var user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true,
                FullName = $"د. {firstName} {lastName}"
            };
            var identityResult = await userManager.CreateAsync(
                user, $"Demo#Dr{i + 1}-{Guid.NewGuid():N}");
            if (!identityResult.Succeeded)
                throw new InvalidOperationException("Demo seed failed to create doctor user.");

            doctors.Add(new Doctor
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                Phone = $"09{20000000 + i}",
                LicenseNumber = $"MED-2015-{i + 1:D4}",
                YearsOfExperience = 3 + random.Next(20),
                Bio = $"استشاري {specialties[i % specialties.Count].Name} بخبرة تتجاوز عشر سنوات.",
                IsActive = true,
                ApplicationUserId = user.Id
            });
        }

        db.Doctors.AddRange(doctors);
        await db.SaveChangesAsync();

        var links = new List<DoctorSpecialty>();
        var schedules = new List<DoctorSchedule>();
        for (var i = 0; i < doctors.Count; i++)
        {
            links.Add(new DoctorSpecialty
            {
                DoctorId = doctors[i].Id,
                SpecialtyId = specialties[i % specialties.Count].Id
            });
            if (i % 3 == 0)
            {
                links.Add(new DoctorSpecialty
                {
                    DoctorId = doctors[i].Id,
                    SpecialtyId = specialties[(i + 3) % specialties.Count].Id
                });
            }

            for (var day = 0; day < 5; day++)
            {
                schedules.Add(new DoctorSchedule
                {
                    DoctorId = doctors[i].Id,
                    DayOfWeek = day,
                    StartTime = new TimeSpan(9, 0, 0),
                    EndTime = new TimeSpan(17, 0, 0),
                    IsActive = true
                });
            }
        }

        db.DoctorSpecialties.AddRange(links);
        db.DoctorSchedules.AddRange(schedules);
        await db.SaveChangesAsync();

        return doctors;
    }

    private static async Task<List<Patient>> SeedPatientsAsync(
        AppDbContext db, Random random, DateTime today)
    {
        var patients = new List<Patient>();
        for (var i = 0; i < PatientCount; i++)
        {
            var male = random.Next(2) == 0;
            var firstName = male
                ? DemoData.MaleFirstNames[random.Next(DemoData.MaleFirstNames.Length)]
                : DemoData.FemaleFirstNames[random.Next(DemoData.FemaleFirstNames.Length)];
            var age = random.Next(1, 85);

            patients.Add(new Patient
            {
                FirstName = firstName,
                LastName = DemoData.LastNames[random.Next(DemoData.LastNames.Length)],
                DateOfBirth = today.AddYears(-age).AddDays(-random.Next(365)),
                Gender = male ? Gender.Male : Gender.Female,
                Phone = $"09{10000000 + i}",
                Email = $"patient{i + 1}@example.com",
                Address = $"{DemoData.Streets[random.Next(DemoData.Streets.Length)]}، بناء {random.Next(1, 120)}",
                City = DemoData.Cities[random.Next(DemoData.Cities.Length)],
                NationalId = $"{1000000000 + i}",
                BloodType = DemoData.BloodTypes[random.Next(DemoData.BloodTypes.Length)],
                EmergencyContactName = DemoData.MaleFirstNames[random.Next(DemoData.MaleFirstNames.Length)],
                EmergencyContactPhone = $"09{30000000 + i}",
                Notes = i % 7 == 0 ? "مريض يحتاج متابعة دورية." : null,
                IsActive = true
            });
        }

        db.Patients.AddRange(patients);
        await db.SaveChangesAsync();

        // Backdate CreatedAt (the SaveChanges override forces UtcNow on insert).
        // Spread over the last 6 months so the growth dashboard has data.
        foreach (var patient in patients)
            patient.CreatedAt = today.AddDays(-random.Next(180)).AddHours(random.Next(24));
        await db.SaveChangesAsync();

        var histories = new List<PatientMedicalHistory>();
        var allergies = new List<PatientAllergy>();
        var insurances = new List<PatientInsurance>();
        for (var i = 0; i < patients.Count; i++)
        {
            if (i % 5 < 2)
            {
                histories.Add(new PatientMedicalHistory
                {
                    PatientId = patients[i].Id,
                    Title = DemoData.ChronicConditions[random.Next(DemoData.ChronicConditions.Length)],
                    Description = "حالة مزمنة تحت المتابعة الدورية.",
                    DiagnosedDate = today.AddYears(-random.Next(1, 10)),
                    Status = MedicalHistoryStatus.Active
                });
            }

            if (i % 7 < 2)
            {
                allergies.Add(new PatientAllergy
                {
                    PatientId = patients[i].Id,
                    Name = DemoData.Allergens[random.Next(DemoData.Allergens.Length)],
                    Type = (AllergyType)random.Next(4),
                    Severity = (AllergySeverity)random.Next(3),
                    Notes = "تجنب التعرض والمحفزات المعروفة."
                });
            }

            if (i % 10 < 3)
            {
                insurances.Add(new PatientInsurance
                {
                    PatientId = patients[i].Id,
                    ProviderName = DemoData.InsuranceProviders[random.Next(DemoData.InsuranceProviders.Length)],
                    PolicyNumber = $"POL-{20240000 + i}",
                    GroupNumber = $"GRP-{100 + (i % 20)}",
                    ExpiryDate = today.AddYears(1),
                    CoveragePercentage = 80,
                    IsActive = true
                });
            }
        }

        db.PatientMedicalHistories.AddRange(histories);
        db.PatientAllergies.AddRange(allergies);
        db.PatientInsurances.AddRange(insurances);
        await db.SaveChangesAsync();

        return patients;
    }

    private static async Task<List<MedicalService>> SeedMedicalServicesAsync(AppDbContext db)
    {
        var categories = DemoData.MedicalServices
            .Select(s => s.Category)
            .Distinct()
            .Select((name, i) => new ServiceCategory
            {
                Name = name,
                Description = $"خدمات {name}",
                SortOrder = i
            })
            .ToList();
        db.ServiceCategories.AddRange(categories);
        await db.SaveChangesAsync();

        var byName = categories.ToDictionary(c => c.Name);
        var services = DemoData.MedicalServices
            .Select((s, i) => new MedicalService
            {
                Name = s.Name,
                Description = s.Name,
                CategoryId = byName[s.Category].Id,
                Price = s.Price,
                DurationMinutes = s.Duration,
                RequiresAppointment = true,
                SortOrder = i
            })
            .ToList();
        db.MedicalServices.AddRange(services);
        await db.SaveChangesAsync();

        return services;
    }

    private static async Task<List<Appointment>> SeedAppointmentsAsync(
        AppDbContext db,
        List<Doctor> doctors,
        List<Patient> patients,
        Random random,
        DateTime today)
    {
        var appointments = new List<Appointment>();
        for (var i = 0; i < AppointmentCount; i++)
        {
            var roll = random.Next(100);
            DateTime date;
            AppointmentStatus status;
            if (roll < 70)
            {
                date = today.AddDays(-random.Next(1, 180));
                status = random.Next(100) < 85
                    ? AppointmentStatus.Completed
                    : random.Next(2) == 0 ? AppointmentStatus.Cancelled : AppointmentStatus.NoShow;
            }
            else if (roll < 72)
            {
                date = today;
                status = (AppointmentStatus)random.Next(3);
            }
            else
            {
                date = today.AddDays(random.Next(1, 30));
                status = random.Next(2) == 0 ? AppointmentStatus.Scheduled : AppointmentStatus.Confirmed;
            }

            var slot = 9 * 60 + random.Next(16) * 30;
            appointments.Add(new Appointment
            {
                PatientId = patients[random.Next(patients.Count)].Id,
                DoctorId = doctors[random.Next(doctors.Count)].Id,
                AppointmentDate = date,
                StartTime = TimeSpan.FromMinutes(slot),
                EndTime = TimeSpan.FromMinutes(slot + 30),
                Status = status,
                Type = (AppointmentType)random.Next(3),
                Reason = DemoData.AppointmentReasons[random.Next(DemoData.AppointmentReasons.Length)],
                Priority = random.Next(100) < 10 ? AppointmentPriority.Urgent : AppointmentPriority.Normal,
                DurationMinutes = 30,
                CancelledAt = status == AppointmentStatus.Cancelled ? date.AddDays(-1) : null,
                CancellationReason = status == AppointmentStatus.Cancelled ? "اعتذار المريض عن الحضور." : null
            });
        }

        const int batchSize = 200;
        for (var i = 0; i < appointments.Count; i += batchSize)
        {
            db.Appointments.AddRange(appointments.Skip(i).Take(batchSize));
            await db.SaveChangesAsync();
        }

        return appointments;
    }

    private static async Task<List<Visit>> SeedVisitsAsync(
        AppDbContext db, List<Appointment> appointments, Random random)
    {
        var eligible = appointments
            .Where(a => a.Status == AppointmentStatus.Completed)
            .OrderBy(_ => random.Next())
            .Take(450)
            .Concat(appointments.Where(a => a.Status == AppointmentStatus.InProgress).Take(10))
            .Concat(appointments
                .Where(a => a.Status is AppointmentStatus.Scheduled or AppointmentStatus.Confirmed
                    && a.AppointmentDate.Date == DateTime.UtcNow.Date)
                .Take(40))
            .ToList();

        var visits = eligible.Select(a => new Visit
        {
            AppointmentId = a.Id,
            PatientId = a.PatientId,
            DoctorId = a.DoctorId,
            VisitDate = a.AppointmentDate,
            ChiefComplaint = DemoData.Complaints[random.Next(DemoData.Complaints.Length)],
            Symptoms = "فحص سريري عام مع قياس العلامات الحيوية.",
            Diagnosis = DemoData.Diagnoses[random.Next(DemoData.Diagnoses.Length)].Name,
            TreatmentPlan = "علاج دوائي مع مراجعة بعد أسبوعين.",
            Status = a.Status == AppointmentStatus.Completed
                ? VisitStatus.Completed
                : random.Next(2) == 0 ? VisitStatus.Waiting : VisitStatus.InConsultation,
            NextVisitRecommended = random.Next(100) < 25,
            NextVisitNotes = "مراجعة للاطمئنان على الاستجابة للعلاج.",
            TotalAmount = 80000,
            DiscountAmount = 0,
            FinalAmount = 80000
        }).ToList();

        const int batchSize = 200;
        for (var i = 0; i < visits.Count; i += batchSize)
        {
            db.Visits.AddRange(visits.Skip(i).Take(batchSize));
            await db.SaveChangesAsync();
        }

        foreach (var appointment in eligible)
            appointment.VisitId = visits.First(v => v.AppointmentId == appointment.Id).Id;
        await db.SaveChangesAsync();

        var diagnoses = new List<VisitDiagnosis>();
        var vitals = new List<VisitVitals>();
        foreach (var visit in visits)
        {
            var primary = DemoData.Diagnoses[random.Next(DemoData.Diagnoses.Length)];
            diagnoses.Add(new VisitDiagnosis
            {
                VisitId = visit.Id,
                Code = primary.Code,
                Name = primary.Name,
                IsPrimary = true
            });
            if (random.Next(100) < 30)
            {
                var secondary = DemoData.Diagnoses[random.Next(DemoData.Diagnoses.Length)];
                diagnoses.Add(new VisitDiagnosis
                {
                    VisitId = visit.Id,
                    Code = secondary.Code,
                    Name = secondary.Name,
                    IsPrimary = false
                });
            }

            if (random.Next(100) < 80)
            {
                var weight = 55 + random.Next(45);
                var height = 155 + random.Next(35);
                vitals.Add(new VisitVitals
                {
                    VisitId = visit.Id,
                    Temperature = 36 + (decimal)random.NextDouble(),
                    BloodPressureSystolic = 110 + random.Next(40),
                    BloodPressureDiastolic = 70 + random.Next(25),
                    HeartRate = 65 + random.Next(35),
                    RespiratoryRate = 14 + random.Next(8),
                    OxygenSaturation = 96 + (decimal)random.NextDouble() * 3,
                    Weight = weight,
                    Height = height,
                    BMI = Math.Round((decimal)weight / ((decimal)height / 100 * ((decimal)height / 100)), 1)
                });
            }
        }

        db.VisitDiagnoses.AddRange(diagnoses);
        await db.SaveChangesAsync();
        db.VisitVitals.AddRange(vitals);
        await db.SaveChangesAsync();

        return visits;
    }

    private static async Task SeedPrescriptionsAsync(
        AppDbContext db, List<Visit> visits, Random random)
    {
        var completed = visits.Where(v => v.Status == VisitStatus.Completed).ToList();
        var selected = completed.OrderBy(_ => random.Next()).Take(300).ToList();

        var prescriptions = selected.Select(v => new Prescription
        {
            VisitId = v.Id,
            PatientId = v.PatientId,
            DoctorId = v.DoctorId,
            PrescriptionDate = v.VisitDate,
            Notes = "تُصرف من الصيدلية المعتمدة.",
            Status = PrescriptionStatus.Active,
            ValidUntil = v.VisitDate.AddMonths(3)
        }).ToList();

        db.Prescriptions.AddRange(prescriptions);
        await db.SaveChangesAsync();

        var items = new List<PrescriptionItem>();
        foreach (var prescription in prescriptions)
        {
            var count = 1 + random.Next(4);
            for (var i = 0; i < count; i++)
            {
                var med = DemoData.Medications[random.Next(DemoData.Medications.Length)];
                items.Add(new PrescriptionItem
                {
                    PrescriptionId = prescription.Id,
                    MedicationName = med.Name,
                    Dosage = med.Dosage,
                    Frequency = med.Frequency,
                    Duration = med.Duration,
                    Quantity = random.Next(1, 4),
                    Instructions = "يؤخذ بعد الطعام.",
                    SortOrder = i
                });
            }
        }

        const int batchSize = 400;
        for (var i = 0; i < items.Count; i += batchSize)
        {
            db.PrescriptionItems.AddRange(items.Skip(i).Take(batchSize));
            await db.SaveChangesAsync();
        }
    }

    private static async Task SeedLabTestsAsync(
        AppDbContext db, List<Visit> visits, Random random)
    {
        var completed = visits.Where(v => v.Status == VisitStatus.Completed).ToList();
        var selected = completed.OrderBy(_ => random.Next()).Take(250).ToList();

        var tests = selected.Select(v =>
        {
            var roll = random.Next(100);
            var status = roll < 70 ? LabTestStatus.Completed
                : roll < 85 ? LabTestStatus.InProgress : LabTestStatus.Ordered;
            var catalog = DemoData.LabTests[random.Next(DemoData.LabTests.Length)];
            return new LabTest
            {
                VisitId = v.Id,
                PatientId = v.PatientId,
                DoctorId = v.DoctorId,
                TestName = catalog.Name,
                TestCategory = catalog.Category,
                OrderedDate = v.VisitDate,
                Status = status,
                Priority = random.Next(100) < 15 ? LabTestPriority.Urgent : LabTestPriority.Normal,
                OrderedByDoctorId = v.DoctorId,
                PerformedByDoctorId = status == LabTestStatus.Ordered ? null : v.DoctorId
            };
        }).ToList();

        const int batchSize = 200;
        for (var i = 0; i < tests.Count; i += batchSize)
        {
            db.LabTests.AddRange(tests.Skip(i).Take(batchSize));
            await db.SaveChangesAsync();
        }

        var results = new List<LabResult>();
        foreach (var test in tests.Where(t => t.Status == LabTestStatus.Completed))
        {
            var count = 2 + random.Next(3);
            for (var i = 0; i < count; i++)
            {
                var param = DemoData.LabParameters[random.Next(DemoData.LabParameters.Length)];
                results.Add(new LabResult
                {
                    LabTestId = test.Id,
                    ParameterName = param.Parameter,
                    Value = (10 + random.NextDouble() * 8).ToString("F1"),
                    Unit = param.Unit,
                    NormalRange = param.Range,
                    IsAbnormal = random.Next(100) < 15,
                    SortOrder = i
                });
            }
        }

        for (var i = 0; i < results.Count; i += batchSize)
        {
            db.LabResults.AddRange(results.Skip(i).Take(batchSize));
            await db.SaveChangesAsync();
        }
    }

    private static async Task<List<Invoice>> SeedInvoicesAsync(
        AppDbContext db,
        List<Visit> visits,
        List<MedicalService> services,
        Guid superAdminId,
        Random random)
    {
        var completed = visits.Where(v => v.Status == VisitStatus.Completed).ToList();
        var selected = completed.OrderBy(_ => random.Next()).Take(400).ToList();
        var counters = new Dictionary<DateTime, int>();

        var invoices = new List<Invoice>();
        foreach (var visit in selected)
        {
            var date = visit.VisitDate.Date;
            counters.TryGetValue(date, out var seq);
            seq++;
            counters[date] = seq;

            var roll = random.Next(100);
            var status = roll < 50 ? InvoiceStatus.Paid
                : roll < 65 ? InvoiceStatus.Issued
                : roll < 80 ? InvoiceStatus.PartiallyPaid
                : roll < 90 ? InvoiceStatus.Overdue
                : roll < 97 ? InvoiceStatus.Draft : InvoiceStatus.Cancelled;

            invoices.Add(new Invoice
            {
                InvoiceNumber = $"INV-{date:yyyyMMdd}-{seq:D4}",
                PatientId = visit.PatientId,
                VisitId = visit.Id,
                DoctorId = visit.DoctorId,
                InvoiceDate = date.AddHours(10),
                DueDate = date.AddDays(14),
                Status = status,
                Notes = "فاتورة خدمات طبية.",
                IssuedBy = superAdminId,
                IssuedAt = status == InvoiceStatus.Draft ? null : date.AddHours(10)
            });
        }

        const int batchSize = 200;
        for (var i = 0; i < invoices.Count; i += batchSize)
        {
            db.Invoices.AddRange(invoices.Skip(i).Take(batchSize));
            await db.SaveChangesAsync();
        }

        var items = new List<InvoiceItem>();
        foreach (var invoice in invoices)
        {
            var count = 1 + random.Next(3);
            decimal subTotal = 0;
            for (var i = 0; i < count; i++)
            {
                var service = services[random.Next(services.Count)];
                var quantity = 1 + random.Next(2);
                var lineTotal = service.Price * quantity;
                subTotal += lineTotal;
                items.Add(new InvoiceItem
                {
                    InvoiceId = invoice.Id,
                    ServiceName = service.Name,
                    MedicalServiceId = service.Id,
                    Quantity = quantity,
                    UnitPrice = service.Price,
                    DiscountAmount = 0,
                    TotalAmount = lineTotal,
                    SortOrder = i
                });
            }

            var discount = subTotal > 200000 ? Math.Round(subTotal * 0.05m, 0) : 0;
            var tax = Math.Round((subTotal - discount) * 0.02m, 0);
            invoice.SubTotal = subTotal;
            invoice.DiscountAmount = discount;
            invoice.TaxAmount = tax;
            invoice.TotalAmount = subTotal - discount + tax;

            invoice.PaidAmount = invoice.Status switch
            {
                InvoiceStatus.Paid => invoice.TotalAmount,
                InvoiceStatus.PartiallyPaid => Math.Round(invoice.TotalAmount * 0.5m, 0),
                _ => 0
            };
            invoice.RemainingAmount = invoice.TotalAmount - invoice.PaidAmount;
        }

        for (var i = 0; i < items.Count; i += batchSize * 2)
        {
            db.InvoiceItems.AddRange(items.Skip(i).Take(batchSize * 2));
            await db.SaveChangesAsync();
        }

        await db.SaveChangesAsync();
        return invoices;
    }

    private static async Task SeedPaymentsAsync(
        AppDbContext db, List<Invoice> invoices, Guid superAdminId, Random random)
    {
        var counters = new Dictionary<DateTime, int>();
        var payments = new List<Payment>();

        foreach (var invoice in invoices.Where(i =>
            i.Status is InvoiceStatus.Paid or InvoiceStatus.PartiallyPaid))
        {
            var date = invoice.InvoiceDate.Date;
            var parts = invoice.Status == InvoiceStatus.Paid ? 1 : 2;
            for (var p = 0; p < parts; p++)
            {
                counters.TryGetValue(date, out var seq);
                seq++;
                counters[date] = seq;

                payments.Add(new Payment
                {
                    PaymentNumber = $"PAY-{date:yyyyMMdd}-{seq:D4}",
                    InvoiceId = invoice.Id,
                    PatientId = invoice.PatientId,
                    Amount = parts == 1
                        ? invoice.TotalAmount
                        : Math.Round(invoice.TotalAmount / 2, 0),
                    PaymentMethod = (PaymentMethod)random.Next(7),
                    PaymentDate = date.AddHours(11 + p),
                    ReferenceNumber = $"REF-{date:yyyyMMdd}-{seq:D4}",
                    ReceivedBy = superAdminId,
                    Status = PaymentStatus.Completed
                });
            }
        }

        const int batchSize = 200;
        for (var i = 0; i < payments.Count; i += batchSize)
        {
            db.Payments.AddRange(payments.Skip(i).Take(batchSize));
            await db.SaveChangesAsync();
        }
    }

    private static async Task SeedFollowUpsAsync(
        AppDbContext db, List<Visit> visits, Random random)
    {
        var candidates = visits
            .Where(v => v.NextVisitRecommended)
            .OrderBy(_ => random.Next())
            .Take(100)
            .ToList();

        var followUps = candidates.Select(v =>
        {
            var completed = random.Next(100) < 40;
            var date = v.VisitDate.AddDays(14 + random.Next(30));
            return new FollowUp
            {
                AppointmentId = v.AppointmentId,
                FollowUpDate = date,
                Notes = "موعد متابعة للاطمئنان على الاستجابة للعلاج.",
                IsCompleted = completed,
                CompletedAt = completed ? date : null
            };
        }).ToList();

        db.FollowUps.AddRange(followUps);
        await db.SaveChangesAsync();
    }

    private static async Task SeedNotificationsAsync(
        AppDbContext db,
        Guid superAdminId,
        List<Invoice> invoices,
        Random random,
        DateTime today)
    {
        var templates = new (NotificationType Type, NotificationPriority Priority, string Title, string Message, string? Url)[]
        {
            (NotificationType.AppointmentReminder, NotificationPriority.Normal, "تذكير بموعد", "لديك موعد غداً في العيادة.", "/appointments"),
            (NotificationType.AppointmentCancelled, NotificationPriority.High, "إلغاء موعد", "تم إلغاء أحد المواعيد القادمة.", "/appointments"),
            (NotificationType.AppointmentCompleted, NotificationPriority.Low, "اكتمال موعد", "تم إتمام موعد اليوم بنجاح.", "/visits"),
            (NotificationType.InvoiceIssued, NotificationPriority.Normal, "إصدار فاتورة", "تم إصدار فاتورة جديدة بانتظار الدفع.", "/billing"),
            (NotificationType.InvoiceOverdue, NotificationPriority.Urgent, "فاتورة متأخرة", "توجد فاتورة تجاوزت تاريخ الاستحقاق.", "/billing"),
            (NotificationType.PaymentReceived, NotificationPriority.Normal, "استلام دفعة", "تم تسجيل دفعة جديدة بنجاح.", "/billing/payments"),
            (NotificationType.LabResultReady, NotificationPriority.Normal, "نتيجة تحليل جاهزة", "نتيجة التحليل المطلوب أصبحت جاهزة.", "/lab-tests"),
            (NotificationType.PrescriptionReady, NotificationPriority.Low, "وصفة جاهزة", "الوصفة الطبية جاهزة للصرف.", "/prescriptions"),
            (NotificationType.FollowUpDue, NotificationPriority.High, "متابعة مستحقة", "حان موعد زيارة المتابعة.", "/visits"),
            (NotificationType.SystemAlert, NotificationPriority.Urgent, "تنبيه النظام", "تحديث نظام العيادة الليلة.", "/clinic"),
        };

        var notifications = new List<Notification>();
        for (var i = 0; i < 150; i++)
        {
            var template = templates[i % templates.Length];
            var isRead = random.Next(100) < 40;
            notifications.Add(new Notification
            {
                UserId = superAdminId,
                Title = template.Title,
                Message = template.Message,
                Type = template.Type,
                Priority = template.Priority,
                RelatedEntityType = template.Type is NotificationType.InvoiceIssued or NotificationType.InvoiceOverdue
                    ? "Invoice"
                    : null,
                RelatedEntityId = template.Type is NotificationType.InvoiceIssued or NotificationType.InvoiceOverdue
                    && invoices.Count > 0
                    ? invoices[random.Next(invoices.Count)].Id
                    : null,
                IsRead = isRead,
                ReadAt = isRead ? today.AddDays(-random.Next(30)) : null,
                ActionUrl = template.Url
            });
        }

        db.Notifications.AddRange(notifications);
        await db.SaveChangesAsync();

        // Spread over the last 30 days (SaveChanges override forces UtcNow on insert).
        foreach (var notification in notifications)
            notification.CreatedAt = today.AddDays(-random.Next(30)).AddHours(random.Next(24));
        await db.SaveChangesAsync();
    }

    private static async Task SeedAuditLogsAsync(
        AppDbContext db,
        ApplicationUser superAdmin,
        List<Patient> patients,
        List<Doctor> doctors,
        List<Invoice> invoices,
        Random random,
        DateTime today)
    {
        var templates = new (AuditAction Action, string EntityType)[]
        {
            (AuditAction.Create, "Patient"), (AuditAction.Update, "Patient"),
            (AuditAction.Create, "Appointment"), (AuditAction.StatusChange, "Appointment"),
            (AuditAction.Create, "Invoice"), (AuditAction.Payment, "Invoice"),
            (AuditAction.Create, "Prescription"), (AuditAction.Create, "LabTest"),
            (AuditAction.Update, "Visit"), (AuditAction.Login, "User"),
            (AuditAction.Export, "Report"), (AuditAction.Print, "Invoice"),
        };

        var logs = new List<AuditLog>();
        for (var i = 0; i < 300; i++)
        {
            var template = templates[random.Next(templates.Length)];
            var patient = patients[random.Next(patients.Count)];
            logs.Add(new AuditLog
            {
                UserId = superAdmin.Id,
                UserName = superAdmin.FullName ?? superAdmin.Email,
                Action = template.Action,
                EntityType = template.EntityType,
                EntityId = template.EntityType switch
                {
                    "Patient" => patient.Id,
                    "Invoice" => invoices.Count > 0 ? invoices[random.Next(invoices.Count)].Id : null,
                    _ => Guid.NewGuid()
                },
                EntityDisplayName = template.EntityType switch
                {
                    "Patient" => $"{patient.FirstName} {patient.LastName}",
                    "Invoice" => "فاتورة خدمات طبية",
                    _ => template.EntityType
                },
                Changes = template.Action is AuditAction.Update or AuditAction.StatusChange
                    ? """[{"field":"Status","old":"Scheduled","new":"Completed"}]"""
                    : null,
                IpAddress = $"192.168.1.{1 + random.Next(200)}",
                Timestamp = today.AddDays(-random.Next(30)).AddHours(random.Next(24)),
                AdditionalInfo = "Demo seed entry."
            });
        }

        const int batchSize = 200;
        for (var i = 0; i < logs.Count; i += batchSize)
        {
            db.AuditLogs.AddRange(logs.Skip(i).Take(batchSize));
            await db.SaveChangesAsync();
        }
    }
}
