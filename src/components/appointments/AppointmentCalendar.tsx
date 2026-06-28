import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  type EventProps,
  type ToolbarProps,
  type View,
} from "react-big-calendar";
import {
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  parse,
  startOfMonth,
  startOfWeek,
  getDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types/appointment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./appointment-calendar.css";

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
  fullTitle: string;
  appointment: Appointment;
}

export interface AppointmentCalendarProps {
  appointments: Appointment[];
  selectedAppointmentId: number | null;
  onSelectAppointment: (appointment: Appointment | null) => void;
  onNewAppointment?: () => void;
}

function appointmentToEvent(a: Appointment, calendarView: View): BigCalendarEvent {
  const start = new Date(a.date);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const time = format(start, "HH:mm", { locale: es });
  const fullTitle = a.status ? `Cita ${time}` : `Cancelada ${time}`;
  const title = calendarView === "month" ? time : fullTitle;
  return { start, end, title, fullTitle, appointment: a };
}

function CalendarEvent({
  event,
  title,
  view,
}: EventProps<BigCalendarEvent> & { view: View }) {
  const isActive = event.appointment.status;
  const displayTitle = view === "month" ? event.title : title;

  return (
    <span
      className={cn(
        "nf-cal-event-label block",
        view === "month" ? "text-center tabular-nums" : "truncate",
        !isActive && "line-through opacity-80"
      )}
      title={event.fullTitle}
    >
      {displayTitle}
    </span>
  );
}

type CalendarToolbarProps = ToolbarProps<BigCalendarEvent, object> & {
  onNewAppointment?: () => void;
};

function CalendarToolbar({
  label,
  onNavigate,
  onView,
  view,
  onNewAppointment,
}: CalendarToolbarProps) {
  const viewButtons: { id: View; label: string }[] = [
    { id: "day", label: "Día" },
    { id: "week", label: "Semana" },
    { id: "month", label: "Mes" },
  ];

  return (
    <div className="mb-4 flex flex-col gap-4 border-b border-border pb-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Calendario
          </p>
          <h2 className="text-xl font-semibold capitalize text-foreground">
            {label}
          </h2>
        </div>
        {onNewAppointment && (
          <Button size="sm" className="shrink-0 shadow-sm" onClick={onNewAppointment}>
            + Nueva cita
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onNavigate("PREV")}
          >
            Anterior
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onNavigate("TODAY")}
          >
            Hoy
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onNavigate("NEXT")}
          >
            Siguiente
          </Button>
        </div>

        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5">
          {viewButtons.map(({ id, label: viewLabel }) => (
            <Button
              key={id}
              type="button"
              variant={view === id ? "default" : "ghost"}
              size="sm"
              className={cn(
                "min-w-[4.25rem] rounded-md shadow-none",
                view !== id && "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onView(id)}
            >
              {viewLabel}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

const MONTH_TOOLBAR_HEIGHT = 190;
const MONTH_WEEKDAY_HEADER = 44;
const MONTH_ROW_HEIGHT = 96;
const MONTH_LAYOUT_BUFFER = 16;
const TIME_VIEW_HEIGHT = 640;

/** Same visible range react-big-calendar uses for month rows. */
function getMonthGridRowCount(viewDate: Date): number {
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const firstVisible = startOfWeek(monthStart, { weekStartsOn: 1 });
  const lastVisible = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const totalDays = differenceInCalendarDays(lastVisible, firstVisible) + 1;
  return Math.ceil(totalDays / 7);
}

function resolveCalendarHeight(view: View, viewDate: Date): number {
  if (view === "month") {
    const rows = getMonthGridRowCount(viewDate);
    return (
      MONTH_TOOLBAR_HEIGHT +
      MONTH_WEEKDAY_HEADER +
      rows * MONTH_ROW_HEIGHT +
      MONTH_LAYOUT_BUFFER
    );
  }
  return TIME_VIEW_HEIGHT;
}

export function AppointmentCalendar({
  appointments,
  selectedAppointmentId,
  onSelectAppointment,
  onNewAppointment,
}: AppointmentCalendarProps) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const calendarHostRef = useRef<HTMLDivElement>(null);

  const events: BigCalendarEvent[] = useMemo(
    () => appointments.map((a) => appointmentToEvent(a, view)),
    [appointments, view]
  );

  const calendarHeight = useMemo(
    () => resolveCalendarHeight(view, date),
    [view, date]
  );

  const selectedEvent =
    events.find((e) => e.appointment.id === selectedAppointmentId) ?? null;

  const eventPropGetter = (event: BigCalendarEvent) => ({
    className: event.appointment.status
      ? "nf-cal-event nf-cal-event--active"
      : "nf-cal-event nf-cal-event--cancelled",
  });

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

  const toolbarComponent = useMemo(
    () =>
      function Toolbar(props: ToolbarProps<BigCalendarEvent, object>) {
        return (
          <CalendarToolbar {...props} onNewAppointment={onNewAppointment} />
        );
      },
    [onNewAppointment]
  );

  const eventComponent = useMemo(
    () =>
      function Event(props: EventProps<BigCalendarEvent>) {
        return <CalendarEvent {...props} view={view} />;
      },
    [view]
  );

  useLayoutEffect(() => {
    const host = calendarHostRef.current;
    if (!host) return;

    const syncCalendarLayout = () => {
      window.dispatchEvent(new Event("resize"));
    };

    syncCalendarLayout();
    const observer = new ResizeObserver(syncCalendarLayout);
    observer.observe(host);

    return () => observer.disconnect();
  }, [view, appointments.length, date, calendarHeight]);

  return (
    <div className="nf-appointment-calendar rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div
        ref={calendarHostRef}
        className="min-h-0 w-full"
        style={{ height: calendarHeight }}
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
          onNavigate={setDate}
          onSelectEvent={(event) => onSelectAppointment(event.appointment)}
          selected={selectedEvent}
          eventPropGetter={eventPropGetter}
          messages={messages}
          culture="es"
          popup
          style={{ height: "100%" }}
          className="rbc-calendar text-foreground"
          components={{
            toolbar: toolbarComponent,
            event: eventComponent,
          }}
        />
      </div>
    </div>
  );
}
