import { describe, it, expect, vi } from "vitest";
import {
  createExpedient,
  updateExpedient,
  getExpedients,
  getExpedient,
} from "./expedients";
import type { ApiClient } from "@/lib/api-client";
import type { CreateRecordPayload, Record as ExpedientRecord } from "@/types/expedient";

function createMockApi() {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } as unknown as ApiClient;
}

const minimalPayload: CreateRecordPayload = {
  patient_id: 1,
  consultation_reason: "Motivo",
  treatment_demand: "Demanda",
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
};

describe("expedients service", () => {
  describe("createExpedient", () => {
    it("posts to /expedients and returns created expedient", async () => {
      const api = createMockApi();
      const created = { id: 5, patient_id: 1, created_at: "2024-01-15T10:00:00Z" };
      vi.mocked(api.post).mockResolvedValue({
        error: false,
        result: true,
        data: created,
        status_code: 201,
      });

      const result = await createExpedient(api, minimalPayload);

      expect(api.post).toHaveBeenCalledWith("/expedients", minimalPayload);
      expect(result).toEqual(created);
    });

    it("throws when API returns error", async () => {
      const api = createMockApi();
      vi.mocked(api.post).mockResolvedValue({
        error: true,
        result: false,
        data: null,
        message: "patient_id inválido",
        status_code: 400,
      });

      await expect(createExpedient(api, minimalPayload)).rejects.toThrow(
        "patient_id inválido"
      );
    });

    it("throws generic message when API returns error without message", async () => {
      const api = createMockApi();
      vi.mocked(api.post).mockResolvedValue({
        error: true,
        result: false,
        data: null,
        status_code: 500,
      });

      await expect(createExpedient(api, minimalPayload)).rejects.toThrow(
        "Error al crear el expediente"
      );
    });
  });

  describe("updateExpedient", () => {
    it("puts to /expedients/:id and returns record", async () => {
      const api = createMockApi();
      const updated = { id: 3, created_at: "", ...minimalPayload, symptoms: [], diagnoses: [], modalities: [] };
      vi.mocked(api.put).mockResolvedValue({
        error: false,
        result: true,
        data: updated,
        status_code: 200,
      });

      const result = await updateExpedient(api, 3, minimalPayload);

      expect(api.put).toHaveBeenCalledWith("/expedients/3", minimalPayload);
      expect(result).toEqual(updated);
    });

    it("throws when API returns error", async () => {
      const api = createMockApi();
      vi.mocked(api.put).mockResolvedValue({
        error: true,
        result: false,
        data: null,
        message: "Expediente no encontrado",
        status_code: 404,
      });

      await expect(updateExpedient(api, 99, minimalPayload)).rejects.toThrow(
        "Expediente no encontrado"
      );
    });
  });

  describe("getExpedients", () => {
    it("gets /expedients and returns array", async () => {
      const api = createMockApi();
      const list = [{ id: 1, patient_id: 1, created_at: "", consultation_reason: "", treatment_demand: "", incident_details: "", physical_description: "", school_area: "", work_area: "", significant_events: "", psychosexual_history: "", family_diagram: "", family_relationship: "", family_mapping: "", family_hypothesis: "", therapeutic_focus: "", therapeutic_goal: "", therapeutic_strategy: "", therapeutic_forecast: "", mental_exam: "", diagnostic_impression: "", diagnostic_notes: "", symptoms: [], diagnoses: [], modalities: [] }];
      vi.mocked(api.get).mockResolvedValue({
        error: false,
        result: true,
        data: list,
        status_code: 200,
      });

      const result = await getExpedients(api);

      expect(api.get).toHaveBeenCalledWith("/expedients");
      expect(result).toEqual(list);
    });

    it("returns empty array when API returns non-array data", async () => {
      const api = createMockApi();
      vi.mocked(api.get).mockResolvedValue({
        error: false,
        result: true,
        data: {} as unknown as ExpedientRecord[],
        status_code: 200,
      });

      const result = await getExpedients(api);

      expect(result).toEqual([]);
    });
  });

  describe("getExpedient", () => {
    it("gets /expedients/:id and returns record", async () => {
      const api = createMockApi();
      const record = { id: 2, created_at: "", ...minimalPayload, symptoms: [], diagnoses: [], modalities: [] };
      vi.mocked(api.get).mockResolvedValue({
        error: false,
        result: true,
        data: record,
        status_code: 200,
      });

      const result = await getExpedient(api, 2);

      expect(api.get).toHaveBeenCalledWith("/expedients/2");
      expect(result).toEqual(record);
    });

    it("throws when API returns error", async () => {
      const api = createMockApi();
      vi.mocked(api.get).mockResolvedValue({
        error: true,
        result: false,
        data: null,
        message: "No autorizado",
        status_code: 403,
      });

      await expect(getExpedient(api, 2)).rejects.toThrow("No autorizado");
    });
  });
});
