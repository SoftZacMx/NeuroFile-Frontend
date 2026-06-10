/** Summary appointment (same shape as API) */
export interface SummaryAppointment {
  id: number;
  date: string;
  status: boolean;
  attended: boolean | null;
  patientId: number;
}

/** Summary clinical note (same shape as API) */
export interface SummaryClinicalNote {
  id: number;
  date: string;
  note: string;
  recordId: number;
}

/** Patient summary from GET /patients/:id/summary */
export interface PatientSummary {
  nextAppointment: SummaryAppointment | null;
  lastAppointment: SummaryAppointment | null;
  lastNote: SummaryClinicalNote | null;
  last4ClinicalNotes: SummaryClinicalNote[];
}
