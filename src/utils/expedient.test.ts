import { describe, it, expect } from "vitest";
import { recordToFormState } from "./expedient";
import type { Record } from "@/types/expedient";

describe("expedient utils", () => {
  describe("recordToFormState", () => {
    const minimalRecord: Record = {
      id: 1,
      patient_id: 10,
      created_at: "2024-01-15T10:00:00Z",
      consultation_reason: "Ansiedad",
      treatment_demand: "Terapia breve",
      incident_details: "",
      physical_description: "",
      school_area: "",
      work_area: "",
      significant_events: "",
      psychosexual_history: "",
      family_diagram: "",
      family_relationship: "",
      family_mapping: "",
      family_hypothesis: "",
      therapeutic_focus: "",
      therapeutic_goal: "",
      therapeutic_strategy: "",
      therapeutic_forecast: "",
      mental_exam: "",
      diagnostic_impression: "",
      diagnostic_notes: "",
      symptoms: [],
      diagnoses: [],
      modalities: [],
    };

    it("maps record fields to form state", () => {
      const form = recordToFormState(minimalRecord);
      expect(form.patient_id).toBe(10);
      expect(form.consultation_reason).toBe("Ansiedad");
      expect(form.treatment_demand).toBe("Terapia breve");
      expect(form.symptoms).toEqual([]);
      expect(form.diagnoses).toEqual([]);
      expect(form.modalities).toEqual([]);
    });

    it("uses empty string for null/undefined string fields", () => {
      const recordWithNulls = {
        ...minimalRecord,
        consultation_reason: null as unknown as string,
        treatment_demand: undefined as unknown as string,
      };
      const form = recordToFormState(recordWithNulls);
      expect(form.consultation_reason).toBe("");
      expect(form.treatment_demand).toBe("");
    });

    it("maps symptoms to SymptomInput with detail", () => {
      const recordWithSymptoms = {
        ...minimalRecord,
        symptoms: [{ id: 1, detail: "Insomnio", recordId: 1 }],
      };
      const form = recordToFormState(recordWithSymptoms);
      expect(form.symptoms).toHaveLength(1);
      expect(form.symptoms![0]).toEqual({ detail: "Insomnio" });
    });

    it("maps diagnoses to DiagnosisInput with optional fields", () => {
      const recordWithDiagnoses = {
        ...minimalRecord,
        diagnoses: [
          {
            id: 1,
            axis: "I",
            dcm: null,
            cie: "F41.1",
            disorder: "Trastorno de ansiedad",
            recordId: 1,
          },
        ],
      };
      const form = recordToFormState(recordWithDiagnoses);
      expect(form.diagnoses).toHaveLength(1);
      expect(form.diagnoses![0]).toEqual({
        axis: "I",
        dcm: undefined,
        cie: "F41.1",
        disorder: "Trastorno de ansiedad",
      });
    });

    it("maps modalities to ModalityInput", () => {
      const recordWithModalities = {
        ...minimalRecord,
        modalities: [
          {
            id: 1,
            ti: true,
            tf: false,
            tp: null,
            tg: null,
            other: null,
            rationale: "Breve",
            recordId: 1,
          },
        ],
      };
      const form = recordToFormState(recordWithModalities);
      expect(form.modalities).toHaveLength(1);
      expect(form.modalities![0]).toEqual({
        ti: true,
        tf: false,
        tp: undefined,
        tg: undefined,
        other: undefined,
        rationale: "Breve",
      });
    });
  });
});
