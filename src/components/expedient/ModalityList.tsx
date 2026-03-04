import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { ModalityItem } from "./ModalityItem";
import type { ModalityInput } from "@/types/expedient";

export interface ModalityListProps {
  modalities: ModalityInput[];
  onChange: (modalities: ModalityInput[]) => void;
}

export function ModalityList({ modalities, onChange }: ModalityListProps) {
  const confirmDialog = useConfirmDialog();

  const handleChange = (index: number, value: ModalityInput) => {
    const next = [...modalities];
    next[index] = value;
    onChange(next);
  };

  const handleRemove = async (index: number) => {
    const ok = await confirmDialog({
      title: "Confirmar eliminación",
      message: "¿Eliminar esta modalidad terapéutica?",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "destructive",
    });
    if (!ok) return;
    onChange(modalities.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([...modalities, { ti: false, tf: false, tp: false, tg: false, other: false }]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Modalidades terapéuticas</h4>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          + Añadir modalidad
        </Button>
      </div>
      {modalities.length === 0 ? (
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          + Añadir modalidad terapéutica
        </Button>
      ) : (
        <div className="space-y-3">
          {modalities.map((m, i) => (
            <ModalityItem
              key={i}
              modality={m}
              index={i}
              onChange={handleChange}
              onRemove={handleRemove}
            />
          ))}
          <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
            + Añadir otra modalidad
          </Button>
        </div>
      )}
    </div>
  );
}
