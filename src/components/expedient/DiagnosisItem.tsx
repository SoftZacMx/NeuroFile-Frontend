import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { type DiagnosisInput, EXPEDIENT_FIELD_MAX_LENGTH } from "@/types/expedient";

export interface DiagnosisItemProps {
  diagnosis: DiagnosisInput;
  index: number;
  onChange: (index: number, value: DiagnosisInput) => void;
  onRemove: (index: number) => void;
}

export function DiagnosisItem({
  diagnosis,
  index,
  onChange,
  onRemove,
}: DiagnosisItemProps) {
  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Diagnóstico {index + 1}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onRemove(index)}
          >
            Eliminar
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Eje</Label>
            <Input
              value={diagnosis.axis ?? ""}
              onChange={(e) =>
                onChange(index, { ...diagnosis, axis: e.target.value })
              }
              placeholder="Eje"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="space-y-2">
            <Label>DCM</Label>
            <Input
              value={diagnosis.dcm ?? ""}
              onChange={(e) =>
                onChange(index, { ...diagnosis, dcm: e.target.value })
              }
              placeholder="DCM"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="space-y-2">
            <Label>CIE</Label>
            <Input
              value={diagnosis.cie ?? ""}
              onChange={(e) =>
                onChange(index, { ...diagnosis, cie: e.target.value })
              }
              placeholder="CIE"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Trastorno / descripción</Label>
            <Input
              value={diagnosis.disorder ?? ""}
              onChange={(e) =>
                onChange(index, { ...diagnosis, disorder: e.target.value })
              }
              placeholder="Descripción del trastorno"
              maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
