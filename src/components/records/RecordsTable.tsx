import { Link } from "react-router-dom";
import type { RecordListItem } from "@/types/expedient";
import { cn } from "@/lib/utils";

export interface RecordsTableProps {
  records: RecordListItem[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

function formatDate(value: string): string {
  try {
    const d = new Date(value);
    return isNaN(d.getTime())
      ? value
      : d.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  } catch {
    return value;
  }
}

function patientDisplayName(record: RecordListItem): string {
  const p = record.patient;
  if (!p) return `Paciente #${record.patient_id}`;
  return [p.first_name, p.last_name, p.second_last_name].filter(Boolean).join(" ");
}

function recordIdDisplay(id: number): string {
  return `EXP-${String(id).padStart(6, "0").slice(-6)}`;
}

export function RecordsTable({
  records,
  loading = false,
  emptyMessage = "No hay expedientes.",
  className,
}: RecordsTableProps) {
  return (
    <div
      className={cn(
        "max-h-[60vh] overflow-y-auto rounded-md border border-border",
        className
      )}
    >
      <table className="w-full table-fixed text-left text-sm">
        <thead className="sticky top-0 z-10 border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 font-medium uppercase tracking-wide text-muted-foreground w-[min(220px,28%)]">
              Paciente
            </th>
            <th className="px-4 py-3 font-medium uppercase tracking-wide text-muted-foreground w-[120px]">
              ID Expediente
            </th>
            <th className="px-4 py-3 font-medium uppercase tracking-wide text-muted-foreground w-[110px]">
              Apertura
            </th>
            <th className="px-4 py-3 font-medium uppercase tracking-wide text-muted-foreground w-[110px]">
              Última Act.
            </th>
            <th className="px-4 py-3 font-medium uppercase tracking-wide text-muted-foreground w-[100px]">
              Estado
            </th>
            <th className="px-4 py-3 font-medium uppercase tracking-wide text-muted-foreground w-[140px]">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                Cargando…
              </td>
            </tr>
          ) : records.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-border last:border-0 hover:bg-muted/30"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                      {patientDisplayName(record).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {patientDisplayName(record)}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {record.patient?.phone ?? "—"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {recordIdDisplay(record.id)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(record.created_at)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(record.created_at)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Completo
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/patients/${record.patient_id}?tab=records`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Ver detalles
                    </Link>
                    <button
                      type="button"
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Editar"
                      title="Editar (próximamente)"
                      disabled
                    >
                      <IconPencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Documento"
                      title="Documento (próximamente)"
                      disabled
                    >
                      <IconDocument className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function IconPencil({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function IconDocument({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}
