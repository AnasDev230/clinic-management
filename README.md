# Medical Clinic Management System | نظام إدارة العيادات الطبية

A full-stack, bilingual (Arabic RTL / English LTR) clinic management system.

نظام متكامل لإدارة العيادات الطبية، ثنائي اللغة (العربية RTL والإنجليزية LTR).

## Tech Stack | التقنيات

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Backend    | ASP.NET Core 9, C# 12, Entity Framework Core 9          |
| Database   | PostgreSQL (Npgsql provider)                            |
| Auth       | ASP.NET Core Identity + JWT (30-min access, 7-day refresh) |
| Validation | FluentValidation (backend), Zod (frontend)              |
| Frontend   | Next.js 16 (App Router), TypeScript 5, React 19         |
| Styling    | Tailwind CSS 4 + shadcn/ui, Cairo font                  |
| State      | TanStack Query 5, Zustand                               |
| Icons      | lucide-react                                            |

## Features | المزايا

- **Dashboard** — overview cards, weekly chart, today schedule, revenue, top doctors, status chart, growth chart, recent activity
- **Patients** — profiles, medical history, allergies, insurance
- **Doctors** — profiles, specialties, schedules
- **Appointments** — booking, today schedule, follow-ups
- **Visits** — consultation, diagnoses, vitals
- **Prescriptions** — prescriptions and items
- **Services** — service catalog and categories
- **Lab Tests** — orders and results
- **Billing** — invoices and payments
- **Notifications** — bell, dropdown, list (polls every 60s)
- **Attachments** — upload/download/preview (10 MB max, PDF/images/Office)
- **Audit Logs** — read-only change tracking (SuperAdmin full, Admin list-only)
- **Clinic** — profile and settings

## Prerequisites | المتطلبات

- .NET 9 SDK
- Node.js 20+
- PostgreSQL 15+

## Setup | التشغيل

### Backend

```bash
cd src/Server
# 1. Configure secrets (never commit real secrets):
#    appsettings.Development.json -> ConnectionStrings:DefaultConnection, JwtSettings:SecretKey
# 2. Apply migrations manually:
dotnet ef database update
# 3. Run (HTTPS: https://localhost:7016, HTTP: http://localhost:5068):
dotnet run
```

### Frontend

```bash
cd src/client
npm install
# .env.local:
# NEXT_PUBLIC_API_URL=https://localhost:7016/api
npm run dev   # http://localhost:3000
```

## Environment Variables | المتغيرات

| Variable | Location | Purpose |
| -------- | -------- | ------- |
| `ConnectionStrings:DefaultConnection` | `appsettings.Development.json` | PostgreSQL connection |
| `JwtSettings:SecretKey` | `appsettings.Development.json` | JWT signing key |
| `CorsAllowedOrigin` | `appsettings.json` | Allowed Next.js origin |
| `DefaultAdmin:Email` / `DefaultAdmin:Password` | `appsettings.Development.json` | Seeded SuperAdmin |
| `NEXT_PUBLIC_API_URL` | `src/client/.env.local` | Backend API base URL |

## Default Credentials | الحساب الافتراضي

Seeded on first run from `DefaultAdmin` config (falls back to `admin@clinic.local` / `Admin@123456` when unconfigured). Change immediately after login. Roles: `SuperAdmin`, `Admin`, `Doctor`, `Receptionist`.

## API Overview | الواجهات

```
Auth:         POST /api/auth/login, /refresh-token, /logout
Dashboard:    GET  /api/dashboard/overview, /today, /weekly, /monthly,
                   /top-doctors, /revenue, /appointments-by-status,
                   /patients-growth, /recent-activity
Patients, Doctors, Appointments, Visits, Prescriptions,
Services, LabTests, Invoices, Payments,
Notifications, Attachments, AuditLogs (Admin only)
```

## Project Docs | الوثائق

- `AGENTS.md` — architecture rules, layer conventions, i18n/RTL standards
- `DESIGN_SYSTEM.md` — colors, components, dark mode
