import { useEffect, useState } from "react";
import type { ApiClient } from "@/lib/api-client";
import { getExpedient } from "@/services/expedients";
import { recordToFormState } from "@/utils/expedient";
import type { ExpedientFormState } from "@/types/expedient";

export interface UseExpedientLoadResult {
  initialState: ExpedientFormState | null;
  loadError: string | null;
  loading: boolean;
}

/**
 * Carga un expediente por id para modo edición y lo devuelve como estado inicial del formulario.
 * Si !isEdit o !id, devuelve loading false e initialState null.
 */
export function useExpedientLoad(
  id: number | null,
  api: ApiClient,
  isEdit: boolean
): UseExpedientLoadResult {
  const [initialState, setInitialState] = useState<ExpedientFormState | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isEdit || id == null) {
      setLoading(false);
      setInitialState(null);
      setLoadError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    getExpedient(api, id)
      .then((record) => {
        if (!cancelled) setInitialState(recordToFormState(record));
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Error al cargar el expediente");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api, isEdit, id]);

  return { initialState, loadError, loading };
}
