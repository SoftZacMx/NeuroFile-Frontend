import type { ReactElement } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialogProvider } from "@/contexts/ConfirmDialogContext";
import { ExpedientForm } from "./ExpedientForm";
import type { ExpedientFormState } from "@/types/expedient";
import type { Patient } from "@/types/patient";

/** Claves que debe tener el payload según CreateRecordPayload (contrato con la API). */
const CREATE_RECORD_PAYLOAD_KEYS = [
  "patient_id",
  "consultation_reason",
  "treatment_demand",
  "incident_details",
  "physical_description",
  "school_area",
  "work_area",
  "significant_events",
  "psychosexual_history",
  "family_diagram",
  "family_relationship",
  "family_mapping",
  "family_hypothesis",
  "therapeutic_focus",
  "therapeutic_goal",
  "therapeutic_strategy",
  "therapeutic_forecast",
  "mental_exam",
  "diagnostic_impression",
  "diagnostic_notes",
  "symptoms",
  "diagnoses",
  "modalities",
] as const;

function renderWithProviders(ui: ReactElement) {
  return render(
    <ConfirmDialogProvider>{ui}</ConfirmDialogProvider>
  );
}

const mockPatients: Patient[] = [
  {
    id: 1,
    first_name: "Juan",
    last_name: "Pérez",
    second_last_name: null,
    age: "30",
    gender: "M",
    phone: "1234567890",
    occupation: "Docente",
    user_id: 1,
    is_active: true,
    address: null,
  },
];

const initialStep1Filled: ExpedientFormState = {
  patient_id: 1,
  consultation_reason: "Ansiedad",
  treatment_demand: "Evaluación",
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

describe("ExpedientForm (integration)", () => {
  it("renders step 1 and disables Next when required fields are empty", () => {
    const onSubmit = vi.fn();
    renderWithProviders(
      <ExpedientForm patients={mockPatients} onSubmit={onSubmit} />
    );

    expect(screen.getByText("Historia clínica")).toBeInTheDocument();
    const nextButton = screen.getByRole("button", { name: /siguiente/i });
    expect(nextButton).toBeDisabled();
  });

  it("enables Next when patient, reason and demand are filled (initialState)", async () => {
    const onSubmit = vi.fn();
    renderWithProviders(
      <ExpedientForm
        patients={mockPatients}
        initialState={initialStep1Filled}
        onSubmit={onSubmit}
      />
    );

    const nextButton = screen.getByRole("button", { name: /siguiente/i });
    expect(nextButton).toBeEnabled();
  });

  it("enables Next after selecting patient and filling reason and demand", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(
      <ExpedientForm patients={mockPatients} onSubmit={onSubmit} />
    );

    const nextButton = screen.getByRole("button", { name: /siguiente/i });
    expect(nextButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /seleccionar paciente/i }));
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: /^seleccionar$/i }));

    await user.type(
      screen.getByLabelText(/motivo de consulta/i),
      "Evaluación por ansiedad"
    );
    await user.type(
      screen.getByLabelText(/demanda de tratamiento/i),
      "Terapia breve"
    );

    expect(nextButton).toBeEnabled();
  });

  it("navigates through steps with Anterior / Siguiente", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(
      <ExpedientForm
        patients={mockPatients}
        initialState={initialStep1Filled}
        onSubmit={onSubmit}
      />
    );

    const nextButton = screen.getByRole("button", { name: /siguiente/i });
    await user.click(nextButton);
    expect(screen.getByRole("button", { name: /anterior/i })).toBeEnabled();

    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);
    expect(screen.getByRole("button", { name: /guardar expediente/i })).toBeInTheDocument();
  });

  it("calls onSubmit with form state when Guardar expediente is clicked", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(
      <ExpedientForm
        patients={mockPatients}
        initialState={initialStep1Filled}
        onSubmit={onSubmit}
      />
    );

    const nextButton = screen.getByRole("button", { name: /siguiente/i });
    for (let i = 0; i < 4; i++) {
      await user.click(nextButton);
    }

    const submitButton = screen.getByRole("button", { name: /guardar expediente/i });
    await user.click(submitButton);

    await expect(onSubmit).toHaveBeenCalledTimes(1);
    const [payload] = onSubmit.mock.calls[0] as [ExpedientFormState];

    expect(payload).toMatchObject({
      patient_id: 1,
      consultation_reason: "Ansiedad",
      treatment_demand: "Evaluación",
    });
    expect(payload.symptoms).toEqual([]);
    expect(payload.diagnoses).toEqual([]);
    expect(payload.modalities).toEqual([]);

    for (const key of CREATE_RECORD_PAYLOAD_KEYS) {
      expect(payload).toHaveProperty(key);
    }
  });

  it("shows error message when onSubmit throws", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error("Error de red"));
    renderWithProviders(
      <ExpedientForm
        patients={mockPatients}
        initialState={initialStep1Filled}
        onSubmit={onSubmit}
      />
    );

    const nextButton = screen.getByRole("button", { name: /siguiente/i });
    for (let i = 0; i < 4; i++) {
      await user.click(nextButton);
    }
    const submitButton = screen.getByRole("button", { name: /guardar expediente/i });
    await user.click(submitButton);

    await screen.findByText("Error de red");
    expect(screen.getByText("Error de red")).toBeInTheDocument();
  });
});
