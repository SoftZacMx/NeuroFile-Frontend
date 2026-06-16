/** Appointment as returned by API (camelCase to match backend) */
export interface Appointment {
  id: number;
  date: string;
  status: boolean;
  attended: boolean | null;
  patientId: number;
}

export interface CreateAppointmentPayload {
  date: string;
  patientId: number;
  status?: boolean;
  attended?: boolean;
}

export interface UpdateAppointmentPayload {
  date?: string;
  status?: boolean;
  attended?: boolean;
}
