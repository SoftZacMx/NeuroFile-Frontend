import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PatientSelectDialog } from "@/components/patient/PatientSelectDialog";
import { type ExpedientFormState, EXPEDIENT_FIELD_MAX_LENGTH } from "@/types/expedient";
import type { Patient } from "@/types/patient";

function IconMic({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function fullName(p: Patient): string {
  return [p.first_name, p.last_name, p.second_last_name]
    .filter(Boolean)
    .join(" ");
}

export interface ReasonAndDemandStepProps {
  state: Pick<
    ExpedientFormState,
    "patient_id" | "consultation_reason" | "treatment_demand"
  >;
  patients: Patient[];
  onChange: (update: Partial<ExpedientFormState>) => void;
  /** Al hacer clic en "Iniciar grabación" se llama con el patient_id actual. */
  onStartRecording?: (patientId: number) => Promise<void>;
}

export function ReasonAndDemandStep({
  state,
  patients,
  onChange,
  onStartRecording,
}: ReasonAndDemandStepProps) {
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const [recordingStarting, setRecordingStarting] = useState(false);
  const selectedPatient = patients.find((p) => p.id === state.patient_id);

  const handleStartRecording = async () => {
    if (!state.patient_id || !onStartRecording) return;
    setRecordingStarting(true);
    try {
      await onStartRecording(state.patient_id);
    } finally {
      setRecordingStarting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Paciente *</Label>
            <div className="flex gap-2">
              <div className="flex min-h-9 flex-1 items-center rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                {selectedPatient
                  ? fullName(selectedPatient)
                  : "Ningún paciente seleccionado"}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectDialogOpen(true)}
              >
                {selectedPatient ? "Cambiar" : "Seleccionar paciente"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-consultation_reason">Motivo de consulta *</Label>
            <Input
              id="exp-consultation_reason"
              value={state.consultation_reason}
              onChange={(e) =>
                onChange({ consultation_reason: e.target.value })
              }
              placeholder="Ej: Evaluación por cefaleas recurrentes"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-treatment_demand">Demanda de tratamiento *</Label>
            <Input
              id="exp-treatment_demand"
              value={state.treatment_demand}
              onChange={(e) => onChange({ treatment_demand: e.target.value })}
              placeholder="Ej: Terapia cognitivo-conductual"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
              required
            />
          </div>
        </CardContent>
      </Card>

      {onStartRecording && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-3">
              Puede iniciar una grabación de sesión para transcribir y generar un borrador del expediente.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleStartRecording}
              disabled={!state.patient_id || recordingStarting}
            >
              <IconMic className="mr-2 h-4 w-4" />
              {recordingStarting ? "Iniciando…" : "Iniciar grabación de sesión"}
            </Button>
          </CardContent>
        </Card>
      )}

      <PatientSelectDialog
        open={selectDialogOpen}
        onOpenChange={setSelectDialogOpen}
        patients={patients}
        onSelect={(patient) => onChange({ patient_id: patient.id })}
      />
    </div>
  );
}
