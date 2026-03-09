export interface DashboardStats {
  activePatients: number;
  appointmentsToday: number;
  appointmentsNextDay: number;
}

export interface DashboardAnalyticsBucket {
  label: string;
  value: number;
}

export interface DashboardAnalytics {
  appointmentsByPeriod: DashboardAnalyticsBucket[];
  clinicalNotesByPeriod: DashboardAnalyticsBucket[];
}
