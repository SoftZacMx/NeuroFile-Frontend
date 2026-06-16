import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { type SymptomInput, EXPEDIENT_FIELD_MAX_LENGTH } from "@/types/expedient";

export interface SymptomItemProps {
  symptom: SymptomInput;
  index: number;
  onChange: (index: number, value: SymptomInput) => void;
  onRemove: (index: number) => void;
}

export function SymptomItem({
  symptom,
  index,
  onChange,
  onRemove,
}: SymptomItemProps) {
  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Síntoma {index + 1}
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
        <div className="space-y-2">
          <Label>Síntoma</Label>
          <Input
            value={symptom.detail}
            onChange={(e) => onChange(index, { ...symptom, detail: e.target.value })}
            placeholder="Ej: Cefalea intensa"
            maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
          />
        </div>
      </CardContent>
    </Card>
  );
}
