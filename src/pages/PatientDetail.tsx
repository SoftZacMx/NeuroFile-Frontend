import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getPatient, getPatientSummary, updatePatient } from "@/services/patients";
import { getExpedients } from "@/services/expedients";
import type { Patient } from "@/types/patient";
import type { PatientSummary } from "@/types/summary";
import type { Record } from "@/types/expedient";
import type { ContactItem } from "@/components/detail/GeneralInfoCard";
import { GeneralInfoCard } from "@/components/detail/GeneralInfoCard";
import { DetailContentTabs } from "@/components/detail/DetailContentTabs";
import { SummaryTab } from "@/components/detail/SummaryTab";
import { RecordResume } from "@/components/record-resume/RecordResume";
import { AppointmentsView } from "@/components/appointments/AppointmentsView";
import { ClinicalNotesView } from "@/components/clinical-notes/ClinicalNotesView";
import { EditPatientDialog } from "@/components/patient/EditPatientDialog";
import { Button } from "@/components/ui/button";

const TABS = [
  { id: "summary", label: "Resumen" },
  { id: "appointments", label: "Citas" },
  { id: "records", label: "Expedientes" },
  { id: "notes", label: "Notas" },
] as const;

function patientToContactItems(patient: Patient): ContactItem[] {
  const items: ContactItem[] = [
    { type: "phone", label: "Teléfono", value: patient.phone },
    { type: "other", label: "Ocupación", value: patient.occupation },
  ];
  if (patient.address) {
    items.push({ type: "address", label: "Dirección", value: patient.address });
  }
  return items;
}

function patientFullName(p: Patient): string {
  return [p.first_name, p.last_name, p.second_last_name].filter(Boolean).join(" ");
}

const TAB_IDS = TABS.map((t) => t.id);
const isValidTabId = (v: string): v is (typeof TABS)[number]["id"] =>
  TAB_IDS.includes(v as (typeof TABS)[number]["id"]);

export default function PatientDetail() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { api } = useAuth();
  const tabFromUrl = searchParams.get("tab");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTabId, setActiveTabId] = useState<(typeof TABS)[number]["id"]>(() =>
    isValidTabId(tabFromUrl ?? "") ? (tabFromUrl as (typeof TABS)[number]["id"]) : TABS[0].id
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [expedients, setExpedients] = useState<Record[] | null>(null);
  const [expedientsLoading, setExpedientsLoading] = useState(false);
  const [refreshAppointmentsKey, setRefreshAppointmentsKey] = useState(0);
  const [summary, setSummary] = useState<PatientSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const loadPatient = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPatient(api, patientId);
      setPatient(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el paciente");
    } finally {
      setLoading(false);
    }
  }, [api, patientId]);

  useEffect(() => {
    loadPatient();
  }, [loadPatient]);

  const loadSummary = useCallback(async () => {
    if (!patientId) return;
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const data = await getPatientSummary(api, patientId);
      setSummary(data);
    } catch (e) {
      setSummaryError(e instanceof Error ? e.message : "Error al cargar el resumen");
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, [api, patientId]);

  useEffect(() => {
    if (patient?.id && activeTabId === "summary") {
      loadSummary();
    }
  }, [patient?.id, activeTabId, loadSummary]);

  const loadExpedients = useCallback(async () => {
    setExpedientsLoading(true);
    try {
      const list = await getExpedients(api);
      setExpedients(list);
    } catch {
      setExpedients([]);
    } finally {
      setExpedientsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (isValidTabId(tabFromUrl ?? "") && tabFromUrl !== activeTabId) {
      setActiveTabId(tabFromUrl as (typeof TABS)[number]["id"]);
    }
  }, [tabFromUrl]);

  useEffect(() => {
    if ((activeTabId === "records" || activeTabId === "notes") && patient?.id) {
      loadExpedients();
    }
  }, [activeTabId, patient?.id, loadExpedients]);

  if (!patientId) {
    navigate("/patients", { replace: true });
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <p className="text-muted-foreground">Cargando paciente...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error ?? "Paciente no encontrado"}</p>
        <Button variant="outline" className="mt-2" asChild>
          <Link to="/patients">Volver a pacientes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 lg:flex-row lg:gap-12">
      <div className="flex shrink-0 flex-col gap-4 lg:w-72">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/patients" className="hover:text-foreground hover:underline">
            Pacientes
          </Link>
          <span>/</span>
          <span className="text-foreground">{patientFullName(patient)}</span>
        </div>
        <div className="flex gap-2 lg:flex-col">
          <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
            Nueva Cita
          </Button>
          <Button
            size="sm"
            className="flex-1 lg:flex-none"
            onClick={() => setEditDialogOpen(true)}
          >
            Editar Perfil
          </Button>
        </div>
        <GeneralInfoCard
          fullName={patientFullName(patient)}
          age={patient.age}
          status={patient.is_active ? "active" : "inactive"}
          contactItems={patientToContactItems(patient)}
        />
      </div>

      <div className="min-w-0 flex-1 pt-4 lg:pt-0 lg:pl-2">
        <DetailContentTabs
          tabs={[...TABS]}
          activeTabId={activeTabId}
          onTabChange={(tabId) => {
            const id = tabId as (typeof TABS)[number]["id"];
            setActiveTabId(id);
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              if (id === TABS[0].id) next.delete("tab");
              else next.set("tab", id);
              return next;
            });
          }}
        >
          {activeTabId === "summary" && (
            <SummaryTab
              summary={summary}
              summaryLoading={summaryLoading}
              summaryError={summaryError}
              onRefresh={loadSummary}
            />
          )}
          {activeTabId === "appointments" && (
            <AppointmentsView
              patient={patient}
              refreshTrigger={refreshAppointmentsKey}
            />
          )}
          {activeTabId === "records" && (
            <>
              {expedientsLoading ? (
                <p className="text-muted-foreground">Cargando expedientes…</p>
              ) : (() => {
                  const patientExpedients = (expedients ?? []).filter(
                    (e) => e.patient_id === patient?.id
                  );
                  const latest =
                    patientExpedients.length > 0
                      ? [...patientExpedients].sort((a, b) => b.id - a.id)[0]
                      : null;
                  if (!latest) {
                    return (
                      <p className="text-muted-foreground">
                        No hay expedientes clínicos para este paciente.
                      </p>
                    );
                  }
                  return <RecordResume record={latest} />;
                })()}
            </>
          )}
          {activeTabId === "notes" && (
            expedientsLoading ? (
              <p className="text-muted-foreground">Cargando…</p>
            ) : (() => {
                const patientExpedients = (expedients ?? []).filter(
                  (e) => e.patient_id === patient?.id
                );
                const latestRecord =
                  patientExpedients.length > 0
                    ? [...patientExpedients].sort((a, b) => b.id - a.id)[0]
                    : null;
                return (
                  <ClinicalNotesView
                    recordId={latestRecord?.id ?? null}
                    patientName={patient ? [patient.first_name, patient.last_name, patient.second_last_name].filter(Boolean).join(" ") : undefined}
                    patientId={patient?.id}
                    onNoteCreated={() =>
                      setRefreshAppointmentsKey((k) => k + 1)
                    }
                  />
                );
              })()
          )}
        </DetailContentTabs>
      </div>

      <EditPatientDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        patient={patient}
        onSuccess={setPatient}
        updatePatient={(payload) =>
          updatePatient(api, patient.id, payload)
        }
      />
    </div>
  );
}
