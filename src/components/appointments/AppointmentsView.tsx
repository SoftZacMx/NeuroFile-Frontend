import { useCallback, useEffect, useMemo, useState } from "react";
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

const APPOINTMENT_MARGIN_MS = 30 * 60 * 1000;

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
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getAppointments(api, {
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setAppointments(list);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [api, dateFrom, dateTo]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments, refreshTrigger]);

  const selectedAppointment =
    appointments.find(
      (a) => a.id === selectedAppointmentId && a.patientId === patient.id
    ) ?? null;

  const patientSpecificAppointments = useMemo(
    () => appointments.filter((a) => a.patientId === patient.id),
    [appointments, patient.id]
  );

  const handleNewAppointment = () => {
    setFormMode("create");
    setEditingAppointment(null);
    setFormOpen(true);
  };

  const handleEdit = (appointment: Appointment) => {
    if (appointment.patientId !== patient.id) return;
    setFormMode("edit");
    setEditingAppointment(appointment);
    setFormOpen(true);
  };

  const handleDelete = useCallback(
    async (appointment: Appointment) => {
      if (appointment.patientId !== patient.id) return;
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
        // Error toast
      }
    },
    [api, confirmDialog, loadAppointments, patient.id]
  );

  const handleFormSubmit = useCallback(
    async (payload: {
      date: string;
      status?: boolean;
      attended?: boolean;
    }) => {
      const payloadDateStr = payload.date.slice(0, 10);

      if (payload.status !== false) {
        const newAppointmentTime = new Date(payload.date).getTime();

        const hasConflict = appointments.some((app) => {
          if (
            formMode === "edit" &&
            editingAppointment &&
            app.id === editingAppointment.id
          ) {
            return false;
          }
          if (app.status === false) return false;

          const existingAppointmentTime = new Date(app.date).getTime();
          const timeDifference = Math.abs(
            newAppointmentTime - existingAppointmentTime
          );
          return timeDifference < APPOINTMENT_MARGIN_MS;
        });

        if (hasConflict) {
          await confirmDialog({
            title: "Horario no disponible",
            message:
              "Ya existe una cita agendada o un espacio ocupado en este horario. Por favor, selecciona una hora con al menos 30 minutos de diferencia.",
            confirmLabel: "Entendido",
            cancelLabel: "",
            variant: "default",
          });
          return;
        }
      }

      try {
        if (formMode === "create") {
          await createAppointment(api, {
            ...payload,
            patientId: patient.id,
          });

          if (dateFrom && payloadDateStr < dateFrom) setDateFrom(payloadDateStr);
          if (dateTo && payloadDateStr > dateTo) setDateTo(payloadDateStr);
        } else if (editingAppointment) {
          await updateAppointment(api, editingAppointment.id, payload);

          if (dateFrom && payloadDateStr < dateFrom) setDateFrom(payloadDateStr);
          if (dateTo && payloadDateStr > dateTo) setDateTo(payloadDateStr);
        }

        await loadAppointments();
      } catch {
        // Error toast
      }
    },
    [
      api,
      formMode,
      editingAppointment,
      patient.id,
      loadAppointments,
      appointments,
      dateFrom,
      dateTo,
      confirmDialog,
    ]
  );

  return (
    <div
      className={`flex max-h-[100vh] flex-col overflow-hidden ${className ?? ""}`.trim()}
    >
      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando agenda global…</p>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-auto">
          <div className="flex shrink-0 flex-wrap items-end gap-4 rounded-lg border border-border bg-muted/30 px-4 py-3 shadow-sm">
            <h3 className="w-full text-sm font-semibold text-foreground sm:w-auto">
              Rango de disponibilidad
            </h3>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="appointment-date-from"
                className="text-xs text-muted-foreground"
              >
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
              <Label
                htmlFor="appointment-date-to"
                className="text-xs text-muted-foreground"
              >
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
                  {appointments.length} espacios ocupados en total
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
              currentPatientId={patient.id}
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
                appointments={patientSpecificAppointments}
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
