import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getExpedient } from "@/services/expedients";
import type { Record, RecordModality } from "@/types/expedient";
import { RecordSection } from "./RecordSection";
import { RecordSubSection } from "./RecordSubSection";
import { RecordCard } from "./RecordCard";
import { SymptomTags } from "./SymptomTags";
import { DiagnosticTable } from "./DiagnosticTable";

const MODALITY_LABELS: { key: keyof Pick<RecordModality, "ti" | "tf" | "tp" | "tg" | "other">; label: string }[] = [
  { key: "ti", label: "Terapia Individual" },
  { key: "tf", label: "Terapia Farmacológica" },
  { key: "tp", label: "Terapia de pareja" },
  { key: "tg", label: "Terapia grupal" },
  { key: "other", label: "Otro" },
];

function formatDate(value: string): string {
  try {
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return value;
  }
}

export interface RecordResumeProps {
  /** Expedient/record ID to load (if not passing record directly) */
  recordId?: number;
  /** Preloaded record (skips fetch when provided) */
  record?: Record | null;
  className?: string;
}

export function RecordResume({
  recordId,
  record: recordProp,
  className,
}: RecordResumeProps) {
  const { api } = useAuth();
  const [record, setRecord] = useState<Record | null>(recordProp ?? null);
  const [loading, setLoading] = useState(!recordProp && recordId != null);
  const [error, setError] = useState<string | null>(null);

  const loadRecord = useCallback(async () => {
    if (recordId == null || recordProp != null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getExpedient(api, recordId);
      setRecord(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el expediente");
    } finally {
      setLoading(false);
    }
  }, [api, recordId, recordProp]);

  useEffect(() => {
    if (recordProp != null) {
      setRecord(recordProp);
      setLoading(false);
      return;
    }
    loadRecord();
  }, [recordProp, loadRecord]);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
        Cargando expediente…
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="text-sm text-destructive">
        {error ?? "Expediente no encontrado"}
      </div>
    );
  }

  const modalitiesWithRationale = record.modalities?.filter(
    (m) => m.rationale?.trim() || MODALITY_LABELS.some((l) => m[l.key])
  ) ?? [];

  return (
    <div className={`max-h-[100vh] overflow-y-auto ${className ?? ""}`}>
      <div className="flex flex-col gap-10">
        {/* 1. Motivo de consulta y antecedentes */}
        <RecordSection number={1} title="Motivo de consulta y antecedentes">
          <RecordSubSection label="Motivo de consulta">
            <p className="whitespace-pre-wrap">{record.consultation_reason || "—"}</p>
          </RecordSubSection>
          <RecordSubSection label="Demanda de tratamiento">
            <p className="whitespace-pre-wrap">{record.treatment_demand || "—"}</p>
          </RecordSubSection>
          <RecordSubSection label="Eventos significativos">
            <p className="whitespace-pre-wrap">{record.significant_events || "—"}</p>
          </RecordSubSection>
          {record.incident_details && (
            <RecordSubSection label="Detalles del incidente">
              <p className="whitespace-pre-wrap">{record.incident_details}</p>
            </RecordSubSection>
          )}
          {record.psychosexual_history && (
            <RecordSubSection label="Historia psicosexual">
              <p className="whitespace-pre-wrap">{record.psychosexual_history}</p>
            </RecordSubSection>
          )}
        </RecordSection>

        {/* 2. Áreas de vida */}
        <RecordSection number={2} title="Áreas de vida">
          <div className="grid gap-4 sm:grid-cols-2">
            <RecordSubSection label="Área académica / escolar">
              <p className="whitespace-pre-wrap">{record.school_area || "—"}</p>
            </RecordSubSection>
            <RecordSubSection label="Área laboral">
              <p className="whitespace-pre-wrap">{record.work_area || "—"}</p>
            </RecordSubSection>
          </div>
        </RecordSection>

        {/* 3. Antecedentes heredo-familiares (optional block) */}
        {(record.family_diagram || record.family_relationship || record.family_mapping || record.family_hypothesis) && (
          <RecordSection number={3} title="Antecedentes heredo-familiares">
            {record.family_diagram && (
              <RecordSubSection label="Diagrama familiar">
                <p className="whitespace-pre-wrap">{record.family_diagram}</p>
              </RecordSubSection>
            )}
            {record.family_relationship && (
              <RecordSubSection label="Relación familiar">
                <p className="whitespace-pre-wrap">{record.family_relationship}</p>
              </RecordSubSection>
            )}
            {record.family_mapping && (
              <RecordSubSection label="Mapeo familiar">
                <p className="whitespace-pre-wrap">{record.family_mapping}</p>
              </RecordSubSection>
            )}
            {record.family_hypothesis && (
              <RecordSubSection label="Hipótesis familiar">
                <p className="whitespace-pre-wrap">{record.family_hypothesis}</p>
              </RecordSubSection>
            )}
          </RecordSection>
        )}

        {/* 4. Examen mental y diagnóstico */}
        <RecordSection number={4} title="Examen mental y diagnóstico">
          {record.mental_exam && (
            <RecordSubSection label="Estado neurocognitivo">
              <RecordCard variant="highlight">
                <p className="whitespace-pre-wrap">{record.mental_exam}</p>
              </RecordCard>
            </RecordSubSection>
          )}
          {record.symptoms?.length > 0 && (
            <RecordSubSection label="Sintomatología identificada">
              <SymptomTags symptoms={record.symptoms} />
            </RecordSubSection>
          )}
          <RecordSubSection label="Impresión diagnóstica">
            <p className="whitespace-pre-wrap">{record.diagnostic_impression || "—"}</p>
          </RecordSubSection>
          {record.diagnoses?.length > 0 && (
            <RecordSubSection label="Diagnósticos">
              <DiagnosticTable diagnoses={record.diagnoses} />
            </RecordSubSection>
          )}
          {record.diagnostic_notes && (
            <RecordSubSection label="Notas diagnósticas">
              <p className="whitespace-pre-wrap">{record.diagnostic_notes}</p>
            </RecordSubSection>
          )}
          {modalitiesWithRationale.length > 0 && (
            <RecordSubSection label="Modalidades de intervención">
              <div className="grid gap-3 sm:grid-cols-2">
                {modalitiesWithRationale.map((m) => {
                  const activeLabels = MODALITY_LABELS.filter((l) => m[l.key])
                    .map((l) => l.label)
                    .join(", ");
                  const title = activeLabels || "Modalidad";
                  return (
                    <RecordCard key={m.id} title={title}>
                      {m.rationale ? (
                        <p className="whitespace-pre-wrap text-muted-foreground">{m.rationale}</p>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </RecordCard>
                  );
                })}
              </div>
            </RecordSubSection>
          )}
        </RecordSection>

        {/* 5. Plan terapéutico */}
        <RecordSection number={5} title="Plan terapéutico">
          {record.therapeutic_focus && (
            <RecordSubSection label="Enfoque terapéutico">
              <RecordCard title={record.therapeutic_focus}>{record.therapeutic_focus}</RecordCard>
            </RecordSubSection>
          )}
          {record.therapeutic_goal && (
            <RecordSubSection label="Objetivo principal">
              <p className="whitespace-pre-wrap">{record.therapeutic_goal}</p>
            </RecordSubSection>
          )}
          {record.therapeutic_strategy && (
            <RecordSubSection label="Estrategia detallada">
              <p className="whitespace-pre-wrap">{record.therapeutic_strategy}</p>
            </RecordSubSection>
          )}
          {record.therapeutic_forecast && (
            <RecordSubSection label="Pronóstico terapéutico">
              <RecordCard title="Pronóstico">
                <p className="whitespace-pre-wrap">{record.therapeutic_forecast}</p>
              </RecordCard>
            </RecordSubSection>
          )}
        </RecordSection>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Última edición: {formatDate(record.created_at)}
      </p>
    </div>
  );
}
