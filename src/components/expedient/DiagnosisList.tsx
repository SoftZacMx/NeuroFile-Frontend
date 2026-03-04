import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { DiagnosisItem } from "./DiagnosisItem";
import type { DiagnosisInput } from "@/types/expedient";

export interface DiagnosisListProps {
  diagnoses: DiagnosisInput[];
  onChange: (diagnoses: DiagnosisInput[]) => void;
}

export function DiagnosisList({ diagnoses, onChange }: DiagnosisListProps) {
  const confirmDialog = useConfirmDialog();

  const handleChange = (index: number, value: DiagnosisInput) => {
    const next = [...diagnoses];
    next[index] = value;
    onChange(next);
  };

  const handleRemove = async (index: number) => {
    const ok = await confirmDialog({
      title: "Confirmar eliminación",
      message: "¿Eliminar este diagnóstico?",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "destructive",
    });
    if (!ok) return;
    onChange(diagnoses.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([...diagnoses, {}]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Impresiones diagnósticas</h4>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          + Añadir diagnóstico
        </Button>
      </div>
      {diagnoses.length === 0 ? (
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          + Añadir primer diagnóstico
        </Button>
      ) : (
        <div className="space-y-3">
          {diagnoses.map((d, i) => (
            <DiagnosisItem
              key={i}
              diagnosis={d}
              index={i}
              onChange={handleChange}
              onRemove={handleRemove}
            />
          ))}
          <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
            + Añadir otro diagnóstico
          </Button>
        </div>
      )}
    </div>
  );
}
