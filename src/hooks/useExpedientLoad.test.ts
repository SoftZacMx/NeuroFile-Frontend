import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useExpedientLoad } from "./useExpedientLoad";
import * as expedientsService from "@/services/expedients";
import type { ApiClient } from "@/lib/api-client";

const mockApi = {} as ApiClient;

const mockRecord = {
  id: 1,
  patient_id: 10,
  created_at: "2024-01-15T10:00:00Z",
  consultation_reason: "Ansiedad",
  treatment_demand: "Terapia",
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

describe("useExpedientLoad", () => {
  beforeEach(() => {
    vi.spyOn(expedientsService, "getExpedient").mockReset();
  });

  it("sets loading false and initialState null when not edit mode", async () => {
    const { result } = renderHook(() =>
      useExpedientLoad(null, mockApi, false)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.initialState).toBeNull();
    expect(result.current.loadError).toBeNull();
    expect(expedientsService.getExpedient).not.toHaveBeenCalled();
  });

  it("sets loading false and initialState null when id is null in edit mode", async () => {
    const { result } = renderHook(() =>
      useExpedientLoad(null, mockApi, true)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.initialState).toBeNull();
    expect(expedientsService.getExpedient).not.toHaveBeenCalled();
  });

  it("calls getExpedient and sets initialState when isEdit true and id provided", async () => {
    vi.mocked(expedientsService.getExpedient).mockResolvedValue(mockRecord);

    const { result } = renderHook(() =>
      useExpedientLoad(1, mockApi, true)
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(expedientsService.getExpedient).toHaveBeenCalledWith(mockApi, 1);
    expect(result.current.initialState).not.toBeNull();
    expect(result.current.initialState?.patient_id).toBe(10);
    expect(result.current.initialState?.consultation_reason).toBe("Ansiedad");
    expect(result.current.loadError).toBeNull();
  });

  it("sets loadError when getExpedient fails", async () => {
    vi.mocked(expedientsService.getExpedient).mockRejectedValue(
      new Error("No encontrado")
    );

    const { result } = renderHook(() =>
      useExpedientLoad(999, mockApi, true)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.initialState).toBeNull();
    expect(result.current.loadError).toBe("No encontrado");
  });
});
