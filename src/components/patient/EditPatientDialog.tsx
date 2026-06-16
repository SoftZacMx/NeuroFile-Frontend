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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Patient } from "@/types/patient";
import type { PatientUpdatePayload } from "@/services/patients";
import {
  normalizePatientGender,
  PATIENT_GENDER_OPTIONS,
} from "./patientFormUtils";

export interface EditPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onSuccess?: (updated: Patient) => void;
  updatePatient: (payload: PatientUpdatePayload) => Promise<Patient>;
}

function SectionHeader({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 pb-2">
      <span className="text-muted-foreground">{icon}</span>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
  );
}

function IconUser() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconContact() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export function EditPatientDialog({
  open,
  onOpenChange,
  patient,
  onSuccess,
  updatePatient: updatePatientFn,
}: EditPatientDialogProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PatientUpdatePayload>({
    first_name: "",
    last_name: "",
    second_last_name: null,
    age: "",
    gender: "",
    address: null,
    is_active: true,
    occupation: "",
    phone: "",
  });

  useEffect(() => {
    if (patient) {
      setForm({
        first_name: patient.first_name ?? "",
        last_name: patient.last_name ?? "",
        second_last_name: patient.second_last_name ?? null,
        age: patient.age ?? "",
        gender: normalizePatientGender(patient.gender),
        address: patient.address ?? null,
        is_active: patient.is_active ?? true,
        occupation: patient.occupation ?? "",
        phone: patient.phone ?? "",
      });
      setError(null);
    }
  }, [patient, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updatePatientFn(form);
      onSuccess?.(updated);
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof PatientUpdatePayload, value: string | boolean | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay>
          <DialogContent className="bg-background">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Editar paciente</DialogTitle>
                <DialogDescription>
                  Complete la información para actualizar la ficha del paciente.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 px-6 pb-4">
                {/* Datos Personales */}
                <div className="space-y-3">
                  <SectionHeader title="Datos personales" icon={<IconUser />} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Nombre</Label>
                      <Input
                        id="first_name"
                        placeholder="Ej. Juan"
                        value={form.first_name}
                        onChange={(e) => update("first_name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Apellidos</Label>
                      <Input
                        id="last_name"
                        placeholder="Ej. Pérez García"
                        value={form.last_name}
                        onChange={(e) => update("last_name", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="second_last_name">Apellido materno (opcional)</Label>
                      <Input
                        id="second_last_name"
                        placeholder="Opcional"
                        value={form.second_last_name ?? ""}
                        onChange={(e) =>
                          update("second_last_name", e.target.value || null)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Edad</Label>
                      <Input
                        id="age"
                        placeholder="Ej. 35"
                        value={form.age}
                        onChange={(e) => update("age", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Género</Label>
                    <select
                      id="gender"
                      value={form.gender}
                      onChange={(e) => update("gender", e.target.value)}
                      className={cn(
                        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      )}
                      required
                    >
                      {PATIENT_GENDER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div className="space-y-3">
                  <SectionHeader
                    title="Información de contacto"
                    icon={<IconContact />}
                  />
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+34 600 000 000"
                        maxLength={13}
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        placeholder="Calle, número, piso, ciudad"
                        value={form.address ?? ""}
                        onChange={(e) =>
                          update("address", e.target.value || null)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Datos adicionales */}
                <div className="space-y-3">
                  <SectionHeader
                    title="Información adicional"
                    icon={<IconBriefcase />}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Ocupación</Label>
                    <Input
                      id="occupation"
                      placeholder="Ej. Docente"
                      value={form.occupation}
                      onChange={(e) => update("occupation", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="is_active"
                      checked={form.is_active}
                      onCheckedChange={(checked) => update("is_active", checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="is_active" className="cursor-pointer">
                        Paciente activo
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Desmarca esta opción para inactivar al paciente sin eliminar su
                        historial clínico.
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              <DialogFooter className="border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Guardando…" : "Guardar paciente"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
