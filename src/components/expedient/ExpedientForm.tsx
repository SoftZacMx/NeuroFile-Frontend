import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ComponentHeader } from "@/components/common/ComponentHeader";
import { ExpedientStepper } from "./ExpedientStepper";
import { ReasonAndDemandStep } from "./steps/ReasonAndDemandStep";
import { HistoryAndIncidentStep } from "./steps/HistoryAndIncidentStep";
import { AntecedentsAndFamilyStep } from "./steps/AntecedentsAndFamilyStep";
import { FocusAndExamStep } from "./steps/FocusAndExamStep";
import { DiagnosisStep } from "./steps/DiagnosisStep";
import type { ExpedientFormState } from "@/types/expedient";
import type { Patient } from "@/types/patient";

const TOTAL_STEPS = 5;
const STEP_LABELS = [
  "01 Datos y motivo",
  "02 Historia clínica",
  "03 Antecedentes",
  "04 Examen y enfoque",
  "05 Diagnóstico",
];

const defaultFormState: ExpedientFormState = {
  patient_id: 0,
  consultation_reason: "",
  treatment_demand: "",
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

export interface ExpedientFormProps {
  patients: Patient[];
  patientName?: string;
  /** Cuando se proporciona, el formulario se usa en modo edición (campos prellenados). */
  initialState?: ExpedientFormState;
  onSubmit: (payload: ExpedientFormState) => Promise<void>;
  /** Si se proporciona, se muestra el botón para iniciar grabación de sesión (solo en paso 1). */
  onStartRecording?: (patientId: number) => Promise<void>;
}

export function ExpedientForm({
  patients,
  patientName,
  initialState,
  onSubmit,
  onStartRecording,
}: ExpedientFormProps) {
  const [state, setState] = useState<ExpedientFormState>(
    initialState ?? defaultFormState
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialState) setState(initialState);
  }, [initialState]);

  const updateState = (update: Partial<ExpedientFormState>) => {
    setState((prev) => ({ ...prev, ...update }));
    setError(null);
  };

  const canNext =
    currentStep === 1
      ? state.patient_id && state.consultation_reason && state.treatment_demand
      : true;
  const canPrev = currentStep > 1;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS && canNext) setCurrentStep((s) => s + 1);
  };

  const handlePrev = () => {
    if (canPrev) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(state);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ComponentHeader
        title="Historia clínica"
        description={
          patientName
            ? `Paciente: ${patientName}`
            : "Complete los pasos para registrar el expediente clínico."
        }
      />

      <ExpedientStepper
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        stepLabels={STEP_LABELS}
      />

      <div className="min-h-[320px]">
        {currentStep === 1 && (
          <ReasonAndDemandStep
            state={state}
            patients={patients}
            onChange={updateState}
            onStartRecording={onStartRecording}
          />
        )}
        {currentStep === 2 && (
          <HistoryAndIncidentStep state={state} onChange={updateState} />
        )}
        {currentStep === 3 && (
          <AntecedentsAndFamilyStep state={state} onChange={updateState} />
        )}
        {currentStep === 4 && (
          <FocusAndExamStep state={state} onChange={updateState} />
        )}
        {currentStep === 5 && (
          <DiagnosisStep state={state} onChange={updateState} />
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrev}
          disabled={!canPrev}
        >
          Anterior
        </Button>
        {currentStep < TOTAL_STEPS ? (
          <Button type="button" onClick={handleNext} disabled={!canNext} data-testid="expedient-next">
            Siguiente
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting} data-testid="expedient-submit">
            {submitting ? "Guardando…" : "Guardar expediente"}
          </Button>
        )}
      </div>
    </div>
  );
}
