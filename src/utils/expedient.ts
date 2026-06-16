import type { ExpedientFormState, Record } from "@/types/expedient";

/**
 * Convierte un Record (API) al estado del formulario de expediente.
 */
export function recordToFormState(record: Record): ExpedientFormState {
  return {
    patient_id: record.patient_id,
    consultation_reason: record.consultation_reason ?? "",
    treatment_demand: record.treatment_demand ?? "",
    incident_details: record.incident_details ?? "",
    physical_description: record.physical_description ?? "",
    school_area: record.school_area ?? "",
    work_area: record.work_area ?? "",
    significant_events: record.significant_events ?? "",
    psychosexual_history: record.psychosexual_history ?? "",
    family_diagram: record.family_diagram ?? "",
    family_relationship: record.family_relationship ?? "",
    family_mapping: record.family_mapping ?? "",
    family_hypothesis: record.family_hypothesis ?? "",
    therapeutic_focus: record.therapeutic_focus ?? "",
    therapeutic_goal: record.therapeutic_goal ?? "",
    therapeutic_strategy: record.therapeutic_strategy ?? "",
    therapeutic_forecast: record.therapeutic_forecast ?? "",
    mental_exam: record.mental_exam ?? "",
    diagnostic_impression: record.diagnostic_impression ?? "",
    diagnostic_notes: record.diagnostic_notes ?? "",
    symptoms: (record.symptoms ?? []).map((s) => ({ detail: s.detail })),
    diagnoses: (record.diagnoses ?? []).map((d) => ({
      axis: d.axis ?? undefined,
      dcm: d.dcm ?? undefined,
      cie: d.cie ?? undefined,
      disorder: d.disorder ?? undefined,
    })),
    modalities: (record.modalities ?? []).map((m) => ({
      ti: m.ti ?? undefined,
      tf: m.tf ?? undefined,
      tp: m.tp ?? undefined,
      tg: m.tg ?? undefined,
      other: m.other ?? undefined,
      rationale: m.rationale ?? undefined,
    })),
  };
}
