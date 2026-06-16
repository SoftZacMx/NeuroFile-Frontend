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
import { Button } from "@/components/ui/button";
import { AppointmentCalendar } from "./AppointmentCalendar";
import { AppointmentDetail } from "./AppointmentDetail";
import { AppointmentList } from "./AppointmentList";
import { AppointmentFormDialog } from "./AppointmentFormDialog";

export interface AppointmentsViewProps {
  patient: Patient;
  /** When this value changes, appointments are refetched (e.g. after creating a clinical note). */
  refreshTrigger?: number;
  /** Opens the create-appointment dialog when true (e.g. from patient detail sidebar). */
  autoOpenCreate?: boolean;
  onAutoOpenCreateHandled?: () => void;
  className?: string;
}

function patientFullName(p: Patient): string {
  return [p.first_name, p.last_name, p.second_last_name]
    .filter(Boolean)
    .join(" ");
}

export function AppointmentsView({
  patient,
  refreshTrigger,
  autoOpenCreate = false,
  onAutoOpenCreateHandled,
  className,
}: AppointmentsViewProps) {
  const { api } = useAuth();
  const confirmDialog = useConfirmDialog();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getAppointments(api, { patientId: patient.id });
      setAppointments(list);
    } catch (e) {
      setAppointments([]);
      setError(
        e instanceof Error ? e.message : "Error al cargar las citas del paciente"
      );
    } finally {
      setLoading(false);
    }
  }, [api, patient.id]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments, refreshTrigger]);

  useEffect(() => {
    if (!autoOpenCreate) return;
    setFormMode("create");
    setEditingAppointment(null);
    setFormOpen(true);
    onAutoOpenCreateHandled?.();
  }, [autoOpenCreate, onAutoOpenCreateHandled]);

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

  if (loading) {
    return (
      <div className={`flex flex-col ${className ?? ""}`.trim()}>
        <p className="text-sm text-muted-foreground">Cargando citas…</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className ?? ""}`.trim()}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {appointments.length === 1
            ? "1 cita registrada para este paciente."
            : `${appointments.length} citas registradas para este paciente.`}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={loadAppointments}>
          Actualizar
        </Button>
      </div>

      {error && (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-destructive">{error}</p>
          <Button type="button" variant="outline" size="sm" onClick={loadAppointments}>
            Reintentar
          </Button>
        </div>
      )}

      <div className="grid min-h-0 gap-6 lg:grid-cols-[1fr_280px]">
        <AppointmentCalendar
          appointments={appointments}
          selectedAppointmentId={selectedAppointmentId}
          onSelectAppointment={(a) => setSelectedAppointmentId(a ? a.id : null)}
          onNewAppointment={handleNewAppointment}
        />
        <div className="min-h-0 space-y-6 lg:min-w-0">
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
