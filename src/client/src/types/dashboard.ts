export interface DashboardOverview {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  todayRevenue: number;
  pendingLabTests: number;
  overdueInvoices: number;
  monthlyRevenue: number;
  newPatientsThisMonth: number;
}

export interface TodaySummary {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  waitingPatients: number;
  inConsultation: number;
  todayRevenue: number;
  todayVisits: number;
  upcomingAppointments: TodayAppointmentItem[];
}

export interface TodayAppointmentItem {
  id: string;
  patientName: string;
  doctorName: string;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
}

export interface WeeklyStats {
  days: DailyStat[];
  totalAppointments: number;
  totalRevenue: number;
}

export interface DailyStat {
  dayName: string;
  date: string;
  appointmentsCount: number;
  revenue: number;
}

export interface MonthlyStats {
  year: number;
  month: number;
  totalAppointments: number;
  totalVisits: number;
  totalPatients: number;
  newPatients: number;
  totalRevenue: number;
  totalPaid: number;
  totalOutstanding: number;
  totalLabTests: number;
  totalPrescriptions: number;
  dailyBreakdown: DailyStat[];
}

export interface TopDoctorItem {
  doctorId: string;
  doctorName: string;
  specialtyName: string;
  appointmentsCount: number;
  completedVisits: number;
  revenue: number;
}

export interface RevenueSummary {
  totalRevenue: number;
  totalPaid: number;
  totalOutstanding: number;
  totalOverdue: number;
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  byMethod: PaymentMethodBreakdown[];
}

export interface PaymentMethodBreakdown {
  method: string;
  count: number;
  amount: number;
}

export interface AppointmentsByStatus {
  status: string;
  count: number;
}

export interface PatientsGrowth {
  months: MonthlyGrowth[];
}

export interface MonthlyGrowth {
  monthName: string;
  year: number;
  newPatients: number;
  totalPatients: number;
}

export interface RecentActivityItem {
  id: string;
  action: string;
  entityType: string;
  entityDisplayName: string;
  userName: string;
  timestamp: string;
}
