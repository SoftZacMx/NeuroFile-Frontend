export interface DashboardStats {
  activePatients: number;
  appointmentsToday: number;
  appointmentsNextDay: number;
}

export interface DashboardTodayAppointment {
  id: number;
  date: string;
  status: boolean;
  attended: boolean | null;
  patientId: number;
  patientName: string;
}
