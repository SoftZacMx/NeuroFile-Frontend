import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DiagnosisList } from "../DiagnosisList";
import { type ExpedientFormState, EXPEDIENT_FIELD_MAX_LENGTH } from "@/types/expedient";

export interface DiagnosisStepProps {
  state: Pick<
    ExpedientFormState,
    "diagnostic_impression" | "diagnostic_notes" | "diagnoses"
  >;
  onChange: (update: Partial<ExpedientFormState>) => void;
}

export function DiagnosisStep({ state, onChange }: DiagnosisStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Impresión diagnóstica
          </h3>
          <div className="space-y-2">
            <Label htmlFor="exp-diagnostic_impression">
              Impresión diagnóstica general
            </Label>
            <Input
              id="exp-diagnostic_impression"
              value={state.diagnostic_impression}
              onChange={(e) =>
                onChange({ diagnostic_impression: e.target.value })
              }
              placeholder="Síntesis diagnóstica"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-diagnostic_notes">Notas diagnósticas</Label>
            <Input
              id="exp-diagnostic_notes"
              value={state.diagnostic_notes}
              onChange={(e) =>
                onChange({ diagnostic_notes: e.target.value })
              }
              placeholder="Observaciones adicionales"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <DiagnosisList
            diagnoses={state.diagnoses ?? []}
            onChange={(diagnoses) => onChange({ diagnoses })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
