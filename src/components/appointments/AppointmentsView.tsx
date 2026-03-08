import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "@/services/appointments";
import type { Appointment } from "@/types/appointment";
import type { Patient } from "@/types/patient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppointmentCalendar } from "./AppointmentCalendar";
import { AppointmentDetail } from "./AppointmentDetail";
import { AppointmentList } from "./AppointmentList";
import { AppointmentFormDialog } from "./AppointmentFormDialog";

export interface AppointmentsViewProps {
  patient: Patient;
  /** When this value changes, appointments are refetched (e.g. after creating a clinical note). */
  refreshTrigger?: number;
  className?: string;
}

function patientFullName(p: Patient): string {
  return [p.first_name, p.last_name, p.second_last_name]
    .filter(Boolean)
    .join(" ");
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AppointmentsView({
  patient,
  refreshTrigger,
  className,
}: AppointmentsViewProps) {
  const { api } = useAuth();
  const confirmDialog = useConfirmDialog();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [dateFrom, setDateFrom] = useState<string>(() => todayISO());
  const [dateTo, setDateTo] = useState<string>(() => todayISO());

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getAppointments(api, {
        patientId: patient.id,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setAppointments(list);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [api, patient.id, dateFrom, dateTo]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments, refreshTrigger]);

  const selectedAppointment =
    appointments.find((a) => a.id === selectedAppointmentId) ?? null;

  const handleNewAppointment = () => {
    setFormMode("create");
    setEditingAppointment(null);
    setFormOpen(true);
  };

  const handleEdit = (appointment: Appointment) => {
    setFormMode("edit");
    setEditingAppointment(appointment);
    setFormOpen(true);
  };

  const handleDelete = useCallback(
    async (appointment: Appointment) => {
      const ok = await confirmDialog({
        title: "Confirmar eliminación",
        message: "¿Eliminar esta cita?",
        confirmLabel: "Eliminar",
        cancelLabel: "Cancelar",
        variant: "destructive",
      });
      if (!ok) return;
      try {
        await deleteAppointment(api, appointment.id);
        setSelectedAppointmentId((id) =>
          id === appointment.id ? null : id
        );
        await loadAppointments();
      } catch {
        // could toast error
      }
    },
    [api, confirmDialog, loadAppointments]
  );

  const handleFormSubmit = useCallback(
    async (payload: {
      date: string;
      status?: boolean;
      attended?: boolean;
    }) => {
      if (formMode === "create") {
        await createAppointment(api, {
          ...payload,
          patientId: patient.id,
        });
      } else if (editingAppointment) {
        await updateAppointment(api, editingAppointment.id, payload);
      }
      await loadAppointments();
    },
    [api, formMode, editingAppointment, patient.id, loadAppointments]
  );

  return (
    <div className={`flex max-h-[100vh] flex-col overflow-hidden ${className ?? ""}`.trim()}>
      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando citas…</p>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-auto">
          <div className="shrink-0 flex flex-wrap items-end gap-4 rounded-lg border border-border bg-muted/30 px-4 py-3 shadow-sm">
            <h3 className="w-full text-sm font-semibold text-foreground sm:w-auto">
              Filtrar por fecha
            </h3>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="appointment-date-from" className="text-xs text-muted-foreground">
                Desde
              </Label>
              <Input
                id="appointment-date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full min-w-[140px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="appointment-date-to" className="text-xs text-muted-foreground">
                Hasta
              </Label>
              <Input
                id="appointment-date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full min-w-[140px]"
              />
            </div>
            {(dateFrom || dateTo) && (
              <>
                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                  {appointments.length} citas
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                  }}
                  className="text-sm text-muted-foreground underline hover:text-foreground"
                >
                  Limpiar filtro
                </button>
              </>
            )}
          </div>
          <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[1fr_280px]">
            <AppointmentCalendar
              appointments={appointments}
              selectedAppointmentId={selectedAppointmentId}
              onSelectAppointment={(a) =>
                setSelectedAppointmentId(a ? a.id : null)
              }
              onNewAppointment={handleNewAppointment}
            />
            <div className="min-h-0 space-y-6 overflow-auto lg:min-w-0">
              <AppointmentDetail
                appointment={selectedAppointment}
                patientName={patientFullName(patient)}
                patientIdDisplay={`#${patient.id}`}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStartConsultation={undefined}
              />
              <AppointmentList
                appointments={appointments}
                selectedAppointmentId={selectedAppointmentId}
                onSelectAppointment={(a) => setSelectedAppointmentId(a.id)}
              />
            </div>
          </div>
        </div>
      )}

      <AppointmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        patientId={patient.id}
        appointment={editingAppointment}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
