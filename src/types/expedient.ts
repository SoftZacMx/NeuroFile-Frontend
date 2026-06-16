/**
 * Max length for string columns in Record and related entities (Symptom, TherapeuticModality, DiagnosticImpression).
 * Matches MySQL VARCHAR(191) from Prisma schema.
 */
export const EXPEDIENT_FIELD_MAX_LENGTH = 191;

/** Single symptom entry for create/update */
export interface SymptomInput {
  detail: string;
}

/** Single diagnosis entry for create/update */
export interface DiagnosisInput {
  axis?: string;
  dcm?: string;
  cie?: string;
  disorder?: string;
}

/** Single modality entry for create/update */
export interface ModalityInput {
  ti?: boolean;
  tf?: boolean;
  tp?: boolean;
  tg?: boolean;
  other?: boolean;
  rationale?: string;
}

/** Payload for creating a clinical record (expedient) - matches backend CreateRecordDTO */
export interface CreateRecordPayload {
  patient_id: number;
  consultation_reason: string;
  treatment_demand: string;
  incident_details: string;
  physical_description: string;
  school_area: string;
  work_area: string;
  significant_events: string;
  psychosexual_history: string;
  family_diagram: string;
  family_relationship: string;
  family_mapping: string;
  family_hypothesis: string;
  therapeutic_focus: string;
  therapeutic_goal: string;
  therapeutic_strategy: string;
  therapeutic_forecast: string;
  mental_exam: string;
  diagnostic_impression: string;
  diagnostic_notes: string;
  symptoms?: SymptomInput[];
  diagnoses?: DiagnosisInput[];
  modalities?: ModalityInput[];
}

/** Form state for the multi-step expedient form (all fields) */
export type ExpedientFormState = CreateRecordPayload;

/** Symptom as returned by API (record detail) */
export interface RecordSymptom {
  id: number;
  detail: string;
  recordId: number;
}

/** Diagnosis as returned by API (record detail) */
export interface RecordDiagnosis {
  id: number;
  axis: string | null;
  dcm: string | null;
  cie: string | null;
  disorder: string | null;
  recordId: number;
}

/** Modality as returned by API (record detail) */
export interface RecordModality {
  id: number;
  ti: boolean | null;
  tf: boolean | null;
  tp: boolean | null;
  tg: boolean | null;
  other: boolean | null;
  rationale: string | null;
  recordId: number;
}

/** Patient summary as returned with record in list (GET /expedients) */
export interface RecordPatientSummary {
  id: number;
  first_name: string;
  last_name: string;
  second_last_name?: string | null;
  phone?: string;
}

/** Full record/expedient as returned by API (for display) */
export interface Record {
  id: number;
  patient_id: number;
  created_at: string;
  consultation_reason: string;
  treatment_demand: string;
  incident_details: string;
  physical_description: string;
  school_area: string;
  work_area: string;
  significant_events: string;
  psychosexual_history: string;
  family_diagram: string;
  family_relationship: string;
  family_mapping: string;
  family_hypothesis: string;
  therapeutic_focus: string;
  therapeutic_goal: string;
  therapeutic_strategy: string;
  therapeutic_forecast: string;
  mental_exam: string;
  diagnostic_impression: string;
  diagnostic_notes: string;
  symptoms: RecordSymptom[];
  diagnoses: RecordDiagnosis[];
  modalities: RecordModality[];
}

/** Record as returned in list (GET /expedients) with optional patient nested */
export type RecordListItem = Record & { patient?: RecordPatientSummary };
