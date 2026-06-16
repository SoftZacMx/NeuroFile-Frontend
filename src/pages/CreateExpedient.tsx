import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { useExpedientLoad } from "@/hooks/useExpedientLoad";
import { useRecording } from "@/hooks/useRecording";
import { getPatients } from "@/services/patients";
import { createExpedient, getExpedient, updateExpedient } from "@/services/expedients";
import { createConversation, endConversation } from "@/services/conversations";
import { ExpedientForm } from "@/components/expedient/ExpedientForm";
import { RecordingOverlay } from "@/components/recording/RecordingOverlay";
import { ProcessingOverlay } from "@/components/recording/ProcessingOverlay";
import type { Patient } from "@/types/patient";
import type { ExpedientFormState } from "@/types/expedient";

export default function CreateExpedient() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const confirmDialog = useConfirmDialog();
  const { expedientId } = useParams<{ expedientId: string }>();
  const id = expedientId != null && expedientId !== "" ? parseInt(expedientId, 10) : null;
  const isEdit = id != null && !Number.isNaN(id);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [recordingConversationId, setRecordingConversationId] = useState<number | null>(null);
  const [recordingRecordId, setRecordingRecordId] = useState<number | null>(null);
  const [recordingEnding, setRecordingEnding] = useState(false);
  const [processingRecordId, setProcessingRecordId] = useState<number | null>(null);

  const { initialState, loadError, loading: expedientLoading } = useExpedientLoad(id, api, isEdit);

  const { micError } = useRecording(recordingConversationId, api, {
    onUploadError: useCallback((err: Error) => {
      toast.error(err.message || "Error al subir el fragmento de audio");
    }, []),
  });

  useEffect(() => {
    if (micError) {
      toast.error(micError.message || "No se pudo acceder al micrófono");
    }
  }, [micError]);

  // Poll expedient while processing recording; redirect when draft is ready
  useEffect(() => {
    if (processingRecordId == null || api == null) return;
    const POLL_MS = 5000;
    const MAX_ATTEMPTS = 60; // 5 min
    let attempts = 0;
    const tick = async () => {
      attempts += 1;
      if (attempts > MAX_ATTEMPTS) {
        toast.error("Tiempo de espera agotado. Abra el expediente manualmente.");
        setProcessingRecordId(null);
        navigate(`/records/${processingRecordId}`, { replace: true });
        return;
      }
      try {
        const record = await getExpedient(api, processingRecordId);
        const hasContent =
          (record.consultation_reason?.trim?.() ?? "") !== "" ||
          (record.treatment_demand?.trim?.() ?? "") !== "" ||
          (record.diagnostic_impression?.trim?.() ?? "") !== "";
        if (hasContent) {
          setProcessingRecordId(null);
          navigate(`/records/${processingRecordId}`, { replace: true });
          return;
        }
      } catch {
        // ignore; will retry
      }
    };
    const id = setInterval(tick, POLL_MS);
    tick();
    return () => clearInterval(id);
  }, [api, processingRecordId, navigate]);

  useEffect(() => {
    let cancelled = false;
    getPatients(api)
      .then((data) => {
        if (!cancelled) setPatients(data);
      })
      .catch(() => {
        if (!cancelled) setPatients([]);
      })
      .finally(() => {
        if (!cancelled && !isEdit) setPatientsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api, isEdit]);

  const handleSubmit = useCallback(
    async (payload: ExpedientFormState) => {
      if (isEdit && id != null) {
        await updateExpedient(api, id, payload);
        toast.success("Expediente actualizado correctamente.");
      } else {
        await createExpedient(api, payload);
        toast.success("Expediente creado correctamente.");
      }
      navigate("/records", { replace: true });
    },
    [api, navigate, isEdit, id]
  );

  const handleStartRecording = useCallback(
    async (patientId: number) => {
      const { conversationId, recordId } = await createConversation(api, { patientId });
      console.log("Inició grabación.", { conversationId, patientId });
      setRecordingConversationId(conversationId);
      if (recordId != null) setRecordingRecordId(recordId);
    },
    [api]
  );

  const handleEndRecording = useCallback(async () => {
    if (recordingConversationId == null) return;
    const recordIdToProcess = recordingRecordId;
    setRecordingEnding(true);
    try {
      await endConversation(api, recordingConversationId);
      setRecordingConversationId(null);
      setRecordingRecordId(null);
      toast.success("Grabación finalizada correctamente.");
      if (recordIdToProcess != null) {
        setProcessingRecordId(recordIdToProcess);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al terminar la grabación");
    } finally {
      setRecordingEnding(false);
    }
  }, [api, recordingConversationId, recordingRecordId]);

  const handleEndRecordingClick = useCallback(async () => {
    const ok = await confirmDialog({
      title: "Terminar grabación",
      message: "¿Está seguro de que desea terminar la grabación?",
      confirmLabel: "Sí, terminar",
      variant: "destructive",
    });
    if (ok) await handleEndRecording();
  }, [confirmDialog, handleEndRecording]);

  if (!isEdit) {
    if (patientsLoading) {
      return (
        <div className="flex min-h-[400px] items-center justify-center p-6">
          <p className="text-muted-foreground">Cargando pacientes…</p>
        </div>
      );
    }
    return (
      <div className="p-6">
        <ExpedientForm
          patients={patients}
          onSubmit={handleSubmit}
          onStartRecording={handleStartRecording}
          key="new"
        />
        {recordingConversationId != null && (
          <RecordingOverlay
            onEndRecording={handleEndRecordingClick}
            isEnding={recordingEnding}
          />
        )}
        {processingRecordId != null && <ProcessingOverlay />}
      </div>
    );
  }

  if (expedientLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <p className="text-muted-foreground">Cargando expediente…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <p className="text-destructive">{loadError}</p>
      </div>
    );
  }

  const patientName =
    initialState != null
      ? patients.find((p) => p.id === initialState.patient_id)?.first_name +
        " " +
        patients.find((p) => p.id === initialState.patient_id)?.last_name
      : undefined;

  return (
    <div className="p-6">
      <ExpedientForm
        key={id}
        patients={patients}
        patientName={patientName}
        initialState={initialState ?? undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
