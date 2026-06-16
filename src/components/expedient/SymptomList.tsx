import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { SymptomItem } from "./SymptomItem";
import type { SymptomInput } from "@/types/expedient";

export interface SymptomListProps {
  symptoms: SymptomInput[];
  onChange: (symptoms: SymptomInput[]) => void;
}

export function SymptomList({ symptoms, onChange }: SymptomListProps) {
  const confirmDialog = useConfirmDialog();

  const handleChange = (index: number, value: SymptomInput) => {
    const next = [...symptoms];
    next[index] = value;
    onChange(next);
  };

  const handleRemove = async (index: number) => {
    const ok = await confirmDialog({
      title: "Confirmar eliminación",
      message: "¿Eliminar este síntoma?",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "destructive",
    });
    if (!ok) return;
    onChange(symptoms.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([...symptoms, { detail: "" }]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Sintomatología actual</h4>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          + Añadir síntoma
        </Button>
      </div>
      {symptoms.length === 0 ? (
        <button
          type="button"
          onClick={handleAdd}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 py-8 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl">
            +
          </span>
          Click para agregar un nuevo síntoma o signo clínico
        </button>
      ) : (
        <div className="space-y-3">
          {symptoms.map((s, i) => (
            <SymptomItem
              key={i}
              symptom={s}
              index={i}
              onChange={handleChange}
              onRemove={handleRemove}
            />
          ))}
          <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
            + Añadir otro síntoma
          </Button>
        </div>
      )}
    </div>
  );
}
