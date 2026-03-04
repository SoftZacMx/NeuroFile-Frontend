import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { type ExpedientFormState, EXPEDIENT_FIELD_MAX_LENGTH } from "@/types/expedient";

export interface AntecedentsAndFamilyStepProps {
  state: Pick<
    ExpedientFormState,
    | "school_area"
    | "work_area"
    | "family_diagram"
    | "family_relationship"
    | "family_mapping"
    | "family_hypothesis"
  >;
  onChange: (update: Partial<ExpedientFormState>) => void;
}

export function AntecedentsAndFamilyStep({
  state,
  onChange,
}: AntecedentsAndFamilyStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Áreas de vida
          </h3>
          <div className="space-y-2">
            <Label htmlFor="exp-school_area">Área escolar</Label>
            <Input
              id="exp-school_area"
              value={state.school_area}
              onChange={(e) => onChange({ school_area: e.target.value })}
              placeholder="Contexto escolar"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-work_area">Área laboral</Label>
            <Input
              id="exp-work_area"
              value={state.work_area}
              onChange={(e) => onChange({ work_area: e.target.value })}
              placeholder="Contexto laboral"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Antecedentes heredo-familiares
          </h3>
          <div className="space-y-2">
            <Label htmlFor="exp-family_diagram">Diagrama familiar</Label>
            <Input
              id="exp-family_diagram"
              value={state.family_diagram}
              onChange={(e) => onChange({ family_diagram: e.target.value })}
              placeholder="Descripción del diagrama familiar"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-family_relationship">Relación familiar</Label>
            <Input
              id="exp-family_relationship"
              value={state.family_relationship}
              onChange={(e) =>
                onChange({ family_relationship: e.target.value })
              }
              placeholder="Dinámicas de relación"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-family_mapping">Mapeo familiar</Label>
            <Input
              id="exp-family_mapping"
              value={state.family_mapping}
              onChange={(e) => onChange({ family_mapping: e.target.value })}
              placeholder="Estructura y roles"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-family_hypothesis">Hipótesis familiar</Label>
            <Input
              id="exp-family_hypothesis"
              value={state.family_hypothesis}
              onChange={(e) =>
                onChange({ family_hypothesis: e.target.value })
              }
              placeholder="Hipótesis clínica sobre la familia"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
