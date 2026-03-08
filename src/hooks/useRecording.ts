import { useEffect, useRef, useState } from "react";
import type { ApiClient } from "@/lib/api-client";
import { uploadFragment } from "@/services/conversations";

export interface UseRecordingOptions {
  onUploadError?: (err: Error) => void;
}

export interface UseRecordingResult {
  /** Error de acceso al micrófono (permiso denegado, dispositivo no disponible, etc.). */
  micError: Error | null;
}

const FRAGMENT_INTERVAL_MS = 60_000;

/**
 * Gestiona micrófono, MediaRecorder y subida de fragmentos mientras conversationId está activo.
 * Al cambiar conversationId a null hace cleanup (stop recorder, stop tracks).
 * Expone micError para que la UI pueda mostrar un mensaje si falla el acceso al micrófono.
 */
export function useRecording(
  conversationId: number | null,
  api: ApiClient,
  options: UseRecordingOptions = {}
): UseRecordingResult {
  const { onUploadError } = options;
  const onUploadErrorRef = useRef(onUploadError);
  onUploadErrorRef.current = onUploadError;

  const [micError, setMicError] = useState<Error | null>(null);
  const fragmentIndexRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingActiveRef = useRef(false);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (conversationId == null) {
      setMicError(null);
      recordingActiveRef.current = false;
      if (intervalIdRef.current != null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      mediaRecorderRef.current = null;
      return;
    }

    const currentConversationId = conversationId;
    fragmentIndexRef.current = 0;
    recordingActiveRef.current = true;
    setMicError(null);

    function startNewRecorder(stream: MediaStream) {
      if (!recordingActiveRef.current) return;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = async (e) => {
        if (e.data.size === 0) return;
        const index = fragmentIndexRef.current;
        fragmentIndexRef.current += 1;
        const recordedAt = new Date().toISOString();
        try {
          await uploadFragment(api, currentConversationId, {
            sequenceIndex: index,
            recordedAt,
            file: e.data,
          });
          console.log("Fragmento enviado.", { conversationId: currentConversationId, index });
        } catch (err) {
          console.error("Error al subir fragmento:", err);
          onUploadErrorRef.current?.(err instanceof Error ? err : new Error(String(err)));
        }
        if (recordingActiveRef.current && streamRef.current) {
          startNewRecorder(streamRef.current);
        }
      };
      recorder.start();
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (!recordingActiveRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        setMicError(null);
        streamRef.current = stream;
        startNewRecorder(stream);
        intervalIdRef.current = setInterval(() => {
          if (!recordingActiveRef.current) return;
          const rec = mediaRecorderRef.current;
          if (rec && rec.state !== "inactive") {
            rec.stop();
          }
        }, FRAGMENT_INTERVAL_MS);
      })
      .catch((err) => {
        console.error("Error al acceder al micrófono:", err);
        recordingActiveRef.current = false;
        setMicError(err instanceof Error ? err : new Error(String(err)));
      });

    return () => {
      setMicError(null);
      recordingActiveRef.current = false;
      if (intervalIdRef.current != null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      mediaRecorderRef.current = null;
    };
  }, [api, conversationId]);

  return { micError };
}
