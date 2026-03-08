import { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Appointment } from "@/types/appointment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (d: Date) => startOfWeek(d, { weekStartsOn: 1 }),
  getDay,
  locales: { es },
});

export interface BigCalendarEvent {
  start: Date;
  end: Date;
  title: string;
  appointment: Appointment;
}

export interface AppointmentCalendarProps {
  appointments: Appointment[];
  selectedAppointmentId: number | null;
  onSelectAppointment: (appointment: Appointment | null) => void;
  onNewAppointment?: () => void;
}

function appointmentToEvent(a: Appointment): BigCalendarEvent {
  const start = new Date(a.date);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const title = a.status ? "Pendiente" : "Cancelada";
  return { start, end, title, appointment: a };
}

export function AppointmentCalendar({
  appointments,
  selectedAppointmentId,
  onSelectAppointment,
  onNewAppointment,
}: AppointmentCalendarProps) {
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("week");
  const [date, setDate] = useState(new Date());

  const events: BigCalendarEvent[] = useMemo(
    () => appointments.map(appointmentToEvent),
    [appointments]
  );

  const selectedEvent =
    events.find((e) => e.appointment.id === selectedAppointmentId) ?? null;

  const handleSelectEvent = (event: BigCalendarEvent) => {
    onSelectAppointment(event.appointment);
  };

  const messages = useMemo(
    () => ({
      date: "Fecha",
      time: "Hora",
      event: "Cita",
      allDay: "Todo el día",
      week: "Semana",
      work_week: "Semana laboral",
      day: "Día",
      month: "Mes",
      previous: "Anterior",
      next: "Siguiente",
      yesterday: "Ayer",
      tomorrow: "Mañana",
      today: "Hoy",
      agenda: "Agenda",
      noEventsInRange: "No hay citas en este rango.",
      showMore: (total: number) => `+${total} más`,
    }),
    []
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Calendario</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDate(new Date())}
          >
            Hoy
          </Button>
          <div className="flex rounded-md border border-input">
            <Button
              variant={view === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("day")}
            >
              Día
            </Button>
            <Button
              variant={view === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("week")}
            >
              Semana
            </Button>
            <Button
              variant={view === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("month")}
            >
              Mes
            </Button>
          </div>
          <Input
            type="search"
            placeholder="Buscar paciente o cita…"
            className="w-48"
          />
          {onNewAppointment && (
            <Button size="sm" onClick={onNewAppointment}>
              + Nueva cita
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-[400px] flex-1 overflow-auto rounded-md border border-border bg-card">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          view={view}
          date={date}
          onView={setView}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          selected={selectedEvent}
          messages={messages}
          culture="es"
          className="rbc-calendar"
        />
      </div>
    </div>
  );
}
