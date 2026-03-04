import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SymptomList } from "../SymptomList";
import { type ExpedientFormState, EXPEDIENT_FIELD_MAX_LENGTH } from "@/types/expedient";

export interface HistoryAndIncidentStepProps {
  state: Pick<
    ExpedientFormState,
    | "incident_details"
    | "physical_description"
    | "significant_events"
    | "psychosexual_history"
    | "symptoms"
  >;
  onChange: (update: Partial<ExpedientFormState>) => void;
}

export function HistoryAndIncidentStep({ state, onChange }: HistoryAndIncidentStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Incidente y descripción
          </h3>
          <div className="space-y-2">
            <Label htmlFor="exp-incident_details">Detalles del incidente *</Label>
            <Input
              id="exp-incident_details"
              value={state.incident_details}
              onChange={(e) => onChange({ incident_details: e.target.value })}
              placeholder="Describa los hechos relevantes"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-physical_description">Descripción física</Label>
            <Input
              id="exp-physical_description"
              value={state.physical_description}
              onChange={(e) =>
                onChange({ physical_description: e.target.value })
              }
              placeholder="Observaciones físicas relevantes"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-significant_events">Eventos significativos</Label>
            <Input
              id="exp-significant_events"
              value={state.significant_events}
              onChange={(e) =>
                onChange({ significant_events: e.target.value })
              }
              placeholder="Eventos relevantes en la historia"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-psychosexual_history">
              Historia psicosexual
            </Label>
            <Input
              id="exp-psychosexual_history"
              value={state.psychosexual_history}
              onChange={(e) =>
                onChange({ psychosexual_history: e.target.value })
              }
              placeholder="Antecedentes relevantes"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <SymptomList
            symptoms={state.symptoms ?? []}
            onChange={(symptoms) => onChange({ symptoms })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
