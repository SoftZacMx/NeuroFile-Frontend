import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ModalityList } from "../ModalityList";
import { type ExpedientFormState, EXPEDIENT_FIELD_MAX_LENGTH } from "@/types/expedient";

export interface FocusAndExamStepProps {
  state: Pick<
    ExpedientFormState,
    | "therapeutic_focus"
    | "therapeutic_goal"
    | "therapeutic_strategy"
    | "therapeutic_forecast"
    | "mental_exam"
    | "modalities"
  >;
  onChange: (update: Partial<ExpedientFormState>) => void;
}

export function FocusAndExamStep({ state, onChange }: FocusAndExamStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Enfoque terapéutico
          </h3>
          <div className="space-y-2">
            <Label htmlFor="exp-therapeutic_focus">Foco terapéutico</Label>
            <Input
              id="exp-therapeutic_focus"
              value={state.therapeutic_focus}
              onChange={(e) =>
                onChange({ therapeutic_focus: e.target.value })
              }
              placeholder="Foco principal de intervención"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-therapeutic_goal">Objetivo terapéutico</Label>
            <Input
              id="exp-therapeutic_goal"
              value={state.therapeutic_goal}
              onChange={(e) =>
                onChange({ therapeutic_goal: e.target.value })
              }
              placeholder="Meta del tratamiento"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-therapeutic_strategy">Estrategia terapéutica</Label>
            <Input
              id="exp-therapeutic_strategy"
              value={state.therapeutic_strategy}
              onChange={(e) =>
                onChange({ therapeutic_strategy: e.target.value })
              }
              placeholder="Estrategias a utilizar"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-therapeutic_forecast">Pronóstico terapéutico</Label>
            <Input
              id="exp-therapeutic_forecast"
              value={state.therapeutic_forecast}
              onChange={(e) =>
                onChange({ therapeutic_forecast: e.target.value })
              }
              placeholder="Expectativa de evolución"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Examen mental
          </h3>
          <div className="space-y-2">
            <Label htmlFor="exp-mental_exam">Resultado del examen mental</Label>
            <Input
              id="exp-mental_exam"
              value={state.mental_exam}
              onChange={(e) => onChange({ mental_exam: e.target.value })}
              placeholder="Hallazgos del examen mental"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <ModalityList
            modalities={state.modalities ?? []}
            onChange={(modalities) => onChange({ modalities })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
