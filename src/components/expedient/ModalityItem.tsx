import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { type ModalityInput, EXPEDIENT_FIELD_MAX_LENGTH } from "@/types/expedient";

export interface ModalityItemProps {
  modality: ModalityInput;
  index: number;
  onChange: (index: number, value: ModalityInput) => void;
  onRemove: (index: number) => void;
}

const MODALITY_LABELS: { key: keyof ModalityInput; label: string }[] = [
  { key: "ti", label: "TI" },
  { key: "tf", label: "TF" },
  { key: "tp", label: "TP" },
  { key: "tg", label: "TG" },
  { key: "other", label: "Otro" },
];

export function ModalityItem({
  modality,
  index,
  onChange,
  onRemove,
}: ModalityItemProps) {
  const handleCheck = (key: keyof ModalityInput, checked: boolean) => {
    onChange(index, { ...modality, [key]: checked });
  };

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Modalidad {index + 1}
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
        <div className="flex flex-wrap gap-4">
          {MODALITY_LABELS.filter((l) => l.key !== "rationale").map(
            ({ key, label }) => (
              <div
                key={key}
                className="flex items-center gap-2"
              >
                <Checkbox
                  id={`mod-${index}-${key}`}
                  checked={!!modality[key]}
                  onCheckedChange={(v) =>
                    handleCheck(key, v === true)
                  }
                />
                <Label htmlFor={`mod-${index}-${key}`} className="font-normal">
                  {label}
                </Label>
              </div>
            )
          )}
        </div>
        <div className="space-y-2">
          <Label>Fundamentación</Label>
          <Input
            value={modality.rationale ?? ""}
            onChange={(e) =>
              onChange(index, { ...modality, rationale: e.target.value })
            }
            placeholder="Justificación de la modalidad"
            maxLength={EXPEDIENT_FIELD_MAX_LENGTH}
          />
        </div>
      </CardContent>
    </Card>
  );
}
