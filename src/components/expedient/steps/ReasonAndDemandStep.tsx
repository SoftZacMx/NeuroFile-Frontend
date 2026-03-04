import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PatientSelectDialog } from "@/components/patient/PatientSelectDialog";
import { type ExpedientFormState, EXPEDIENT_FIELD_MAX_LENGTH } from "@/types/expedient";
import type { Patient } from "@/types/patient";

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
}

export function ReasonAndDemandStep({
  state,
  patients,
  onChange,
}: ReasonAndDemandStepProps) {
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const selectedPatient = patients.find((p) => p.id === state.patient_id);

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

      <PatientSelectDialog
        open={selectDialogOpen}
        onOpenChange={setSelectDialogOpen}
        patients={patients}
        onSelect={(patient) => onChange({ patient_id: patient.id })}
      />
    </div>
  );
}
