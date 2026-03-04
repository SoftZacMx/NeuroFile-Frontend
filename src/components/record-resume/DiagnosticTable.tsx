import type { RecordDiagnosis } from "@/types/expedient";

export interface DiagnosticTableProps {
  diagnoses: RecordDiagnosis[];
  className?: string;
}

export function DiagnosticTable({ diagnoses, className }: DiagnosticTableProps) {
  if (!diagnoses?.length) return null;
  return (
    <div className={className}>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 font-medium uppercase tracking-wide text-muted-foreground">
                Eje
              </th>
              <th className="px-4 py-3 font-medium uppercase tracking-wide text-muted-foreground">
                DCM-V
              </th>
              <th className="px-4 py-3 font-medium uppercase tracking-wide text-muted-foreground">
                CIE-10/M
              </th>
              <th className="px-4 py-3 font-medium uppercase tracking-wide text-muted-foreground">
                Trastorno / Descripción
              </th>
            </tr>
          </thead>
          <tbody>
            {diagnoses.map((d) => (
              <tr key={d.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{d.axis ?? "—"}</td>
                <td className="px-4 py-3 text-foreground">{d.dcm ?? "—"}</td>
                <td className="px-4 py-3 text-foreground">{d.cie ?? "—"}</td>
                <td className="px-4 py-3 text-foreground">
                  {d.disorder ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
