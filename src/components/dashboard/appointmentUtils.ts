import type { DashboardTodayAppointment } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export function formatAppointmentTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatAgendaDateSubtitle(dayOffset = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  const formatted = date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function getAppointmentStatusLabel(
  appointment: DashboardTodayAppointment
): string {
  if (!appointment.status) return "Cancelada";
  if (appointment.attended === true) return "Atendida";
  if (appointment.attended === false) return "No atendida";
  return "Pendiente";
}

export function getAppointmentStatusClassName(
  appointment: DashboardTodayAppointment
): string {
  if (!appointment.status) {
    return "bg-muted text-muted-foreground";
  }
  if (appointment.attended === true) {
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
  }
  if (appointment.attended === false) {
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
  }
  return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
}

export function appointmentStatusClassName(
  appointment: DashboardTodayAppointment
): string {
  return cn(
    "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
    getAppointmentStatusClassName(appointment)
  );
}
