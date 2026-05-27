import { useCallback, useMemo, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Navigate,
  Views,
  type Components,
  type EventProps,
  type NavigateAction,
  type View,
} from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  endOfWeek,
  getDay,
  setHours,
  setMinutes,
} from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types/appointment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (d: Date) => startOfWeek(d, { weekStartsOn: 1 }),
  getDay,
  locales: { es },
});

const CLINIC_OPEN = { hour: 8, minute: 0 };
const CLINIC_CLOSE = { hour: 20, minute: 0 };

const calendarMin = setMinutes(
  setHours(new Date(1970, 0, 1), CLINIC_OPEN.hour),
  CLINIC_OPEN.minute
);
const calendarMax = setMinutes(
  setHours(new Date(1970, 0, 1), CLINIC_CLOSE.hour),
  CLINIC_CLOSE.minute
);

export interface BigCalendarEvent {
  start: Date;
  end: Date;
  title: string;
  appointment: Appointment;
}

export interface AppointmentCalendarProps {
  appointments: Appointment[];
  selectedAppointmentId: number | null;
  currentPatientId: number;
  onSelectAppointment: (appointment: Appointment | null) => void;
  onNewAppointment?: () => void;
}

function appointmentToEvent(a: Appointment): BigCalendarEvent {
  const start = new Date(a.date);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const statusLabel = a.status ? "Pendiente" : "Cancelada";
  const timeLabel = format(start, "HH:mm", { locale: es });
  return {
    start,
    end,
    title: `${timeLabel} · ${statusLabel}`,
    appointment: a,
  };
}

type CalendarViewStatic = {
  navigate: (date: Date, action: NavigateAction) => Date;
};

function getViewStatic(view: View): CalendarViewStatic {
  return (Views as unknown as Record<View, CalendarViewStatic>)[view];
}

function navigateDate(
  current: Date,
  view: View,
  action: NavigateAction
): Date {
  if (action === Navigate.TODAY) return new Date();
  return getViewStatic(view).navigate(current, action);
}

function formatRangeLabel(date: Date, view: View): string {
  switch (view) {
    case "month":
      return format(date, "MMMM yyyy", { locale: es });
    case "day":
      return format(date, "EEEE, d 'de' MMMM yyyy", { locale: es });
    case "week":
    default: {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = endOfWeek(date, { weekStartsOn: 1 });
      const sameYear = start.getFullYear() === end.getFullYear();
      const startFmt = format(start, "d MMM", { locale: es });
      const endFmt = format(
        end,
        sameYear ? "d MMM yyyy" : "d MMM yyyy",
        { locale: es }
      );
      return `${startFmt} – ${endFmt}`;
    }
  }
}

function IconChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

interface CalendarEventProps extends EventProps<BigCalendarEvent> {
  selectedAppointmentId: number | null;
  currentPatientId: number; 
}

function CalendarEvent({
  event,
  title,
  selectedAppointmentId,
  currentPatientId,
}: CalendarEventProps) {
  const isMyPatient = event.appointment.patientId === currentPatientId;
  const isSelected = event.appointment.id === selectedAppointmentId;
  const isActive = event.appointment.status;

  // Extraemos y formateamos la hora exacta de la cita (ej: "17:00")
  const timeFormatted = format(new Date(event.appointment.date), "HH:mm", { locale: es });

  if (!isMyPatient) {
    // CASO CORREGIDO: Ahora muestra la hora para que el psicólogo sepa exactamente qué fracción del día está comprometida
    return (
      <div
        className={cn(
          "flex h-full min-h-0 flex-col justify-center border-dashed border-muted-foreground/20 bg-muted/50 px-2 py-0.5 rounded",
          "text-[11px] font-normal leading-tight tracking-tight text-muted-foreground/80 select-none cursor-not-allowed"
        )}
      >
        <span className="truncate">
          <span className="font-medium text-muted-foreground/60">{timeFormatted}</span> · Ocupado
        </span>
      </div>
    );
  }

  // Caso: Cita de ESTE paciente (Editable e interactivo)
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col justify-center gap-0.5 overflow-hidden rounded border px-2 py-0.5",
        "text-xs font-medium leading-tight tracking-tight transition-colors cursor-pointer",
        isActive
          ? isSelected
            ? "border-primary bg-primary text-primary-foreground shadow-sm"
            : "border-primary/25 bg-primary/10 text-foreground hover:border-primary/40 hover:bg-primary/15"
          : isSelected
            ? "border-muted-foreground/50 bg-muted text-foreground"
            : "border-border/80 bg-muted/30 text-muted-foreground"
      )}
    >
      <span className="truncate">{title}</span>
    </div>
  );
}

export function AppointmentCalendar({
  appointments,
  selectedAppointmentId,
  currentPatientId, 
  onSelectAppointment,
  onNewAppointment,
}: AppointmentCalendarProps) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  const events: BigCalendarEvent[] = useMemo(
    () => appointments.map(appointmentToEvent),
    [appointments]
  );

  const selectedEvent =
    events.find((e) => e.appointment.id === selectedAppointmentId) ?? null;

  const rangeLabel = useMemo(() => formatRangeLabel(date, view), [date, view]);

  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const handleToolbarNavigate = useCallback(
    (action: NavigateAction) => {
      setDate((current) => navigateDate(current, view, action));
    },
    [view]
  );

  const handleSelectEvent = useCallback(
    (event: BigCalendarEvent) => {
      if (event.appointment.patientId !== currentPatientId) return;
      onSelectAppointment(event.appointment);
    },
    [onSelectAppointment, currentPatientId]
  );

  const components: Components<BigCalendarEvent> = useMemo(
    () => ({
      event: (props) => (
        <CalendarEvent
          {...props}
          selectedAppointmentId={selectedAppointmentId}
          currentPatientId={currentPatientId} 
        />
      ),
    }),
    [selectedAppointmentId, currentPatientId]
  );

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

  const eventPropGetter = useCallback(
    (event: BigCalendarEvent, _start: Date, _end: Date, isSelected: boolean) => {
      const isMyPatient = event.appointment.patientId === currentPatientId;
      return {
        className: cn(
          "!border-0 !bg-transparent !p-0.5 !shadow-none",
          (!isMyPatient || isSelected) && "!outline-none"
        ),
        style: { 
          outline: "none",
          pointerEvents: isMyPatient ? ("auto" as const) : ("none" as const) 
        },
      };
    },
    [currentPatientId]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {/* Toolbar Superior */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => handleToolbarNavigate(Navigate.PREVIOUS)}>
              <IconChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleToolbarNavigate(Navigate.TODAY)}>
              Hoy
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleToolbarNavigate(Navigate.NEXT)}>
              <span className="hidden sm:inline">Siguiente</span>
              <IconChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="min-w-0 truncate text-lg font-semibold capitalize tracking-tight text-foreground">
            {rangeLabel}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-input">
            <Button
              variant={view === "month" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setView("month")}
            >
              Mes
            </Button>
            <Button
              variant={view === "week" ? "default" : "ghost"}
              size="sm"
              className="rounded-none border-x border-input"
              onClick={() => setView("week")}
            >
              Semana
            </Button>
            <Button
              variant={view === "day" ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setView("day")}
            >
              Día
            </Button>
          </div>
          <Input type="search" placeholder="Buscar paciente o cita…" className="w-48" />
          {onNewAppointment && (
            <Button size="sm" onClick={onNewAppointment}>
              + Nueva cita
            </Button>
          )}
        </div>
      </div>

      {/* Contenedor del Calendario */}
      <div
        className={cn(
          "min-h-[480px] flex-1 overflow-auto rounded-lg border border-border bg-card p-1",
          "[&_.rbc-calendar]:border-0 [&_.rbc-calendar]:bg-transparent",
          "[&_.rbc-header]:border-b [&_.rbc-header]:border-border [&_.rbc-header]:py-2.5",
          "[&_.rbc-header]:text-[11px] [&_.rbc-header]:font-medium [&_.rbc-header]:uppercase [&_.rbc-header]:tracking-wider [&_.rbc-header]:text-muted-foreground",
          "[&_.rbc-time-header]:border-border",
          "[&_.rbc-time-content]:border-border",
          "[&_.rbc-timeslot-group]:border-border/50",
          "[&_.rbc-time-gutter]:text-[11px] [&_.rbc-time-gutter]:text-muted-foreground",
          "[&_.rbc-time-slot]:text-[11px]",
          "[&_.rbc-time-slot]:py-4 [&_.rbc-time-slot]:h-12",
          "[&_.rbc-today]:bg-primary/5",
          "[&_.rbc-off-range-bg]:bg-muted/15",
          "[&_.rbc-current-time-indicator]:bg-primary",
          "[&_.rbc-event]:!border-0 [&_.rbc-event]:!bg-transparent [&_.rbc-event]:!p-0.5 [&_.rbc-event]:!shadow-none",
          "[&_.rbc-event-label]:hidden",
          "[&_.rbc-event-content]:h-full",
          "[&_.rbc-selected-cell]:bg-primary/10",
          "[&_.rbc-month-row]:border-border/60",
          "[&_.rbc-day-bg]:border-border/40"
        )}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          view={view}
          date={date}
          onView={setView}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          selected={selectedEvent}
          messages={messages}
          culture="es"
          toolbar={false}
          min={calendarMin}
          max={calendarMax}
          components={components}
          eventPropGetter={eventPropGetter}
          className="rbc-calendar h-full"
          step={30}
          timeslots={2}
        />
      </div>
    </div>
  );
}