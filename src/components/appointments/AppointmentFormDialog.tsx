import { useState, useEffect } from "react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Appointment } from "@/types/appointment";

export interface AppointmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  patientId: number;
  appointment?: Appointment | null;
  onSubmit: (payload: {
    date: string;
    status?: boolean;
    attended?: boolean;
  }) => Promise<void>;
}

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value: string): string {
  if (!value) return "";
  return new Date(value).toISOString();
}

export function AppointmentFormDialog({
  open,
  onOpenChange,
  mode,
  patientId: _patientId,
  appointment,
  onSubmit,
}: AppointmentFormDialogProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState("");
  const [status, setStatus] = useState(true);
  const [attended, setAttended] = useState<boolean | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      if (mode === "edit" && appointment) {
        setDateTime(toDatetimeLocal(appointment.date));
        setStatus(appointment.status);
        setAttended(appointment.attended);
      } else {
        const now = new Date();
        now.setMinutes(0, 0, 0);
        setDateTime(toDatetimeLocal(now.toISOString()));
        setStatus(true);
        setAttended(null);
      }
    }
  }, [open, mode, appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const date = fromDatetimeLocal(dateTime);
    if (!date) {
      setError("Indique fecha y hora");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        date,
        status,
        attended: attended ?? undefined,
      });
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {mode === "create" ? "Nueva cita" : "Editar cita"}
                </DialogTitle>
                <DialogDescription>
                  {mode === "create"
                    ? "Indique la fecha y hora de la cita."
                    : "Modifique los datos de la cita."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 px-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="appointment-datetime">Fecha y hora</Label>
                  <Input
                    id="appointment-datetime"
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="appointment-status"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                  />
                  <Label htmlFor="appointment-status" className="font-normal">
                    Activa (pendiente)
                  </Label>
                </div>
                {mode === "edit" && (
                  <div className="space-y-2">
                    <Label>Atendida</Label>
                    <select
                      value={attended === null ? "" : attended ? "yes" : "no"}
                      onChange={(e) => {
                        const v = e.target.value;
                        setAttended(
                          v === "" ? null : v === "yes"
                        );
                      }}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    >
                      <option value="">Sin indicar</option>
                      <option value="yes">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                )}
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Guardando…" : mode === "create" ? "Crear cita" : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
