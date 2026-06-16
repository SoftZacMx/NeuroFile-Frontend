import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getExpedients } from "@/services/expedients";
import type { Record } from "@/types/expedient";

export function usePatientExpedients(patientId: number | undefined, enabled: boolean) {
  const { api } = useAuth();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecords = useCallback(
    async (isRefresh = false) => {
      if (patientId == null) return;
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        const list = await getExpedients(api, { patientId });
        setRecords(list);
      } catch (e) {
        if (!isRefresh) {
          setRecords([]);
        }
        setError(
          e instanceof Error
            ? e.message
            : "Error al cargar los expedientes del paciente"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [api, patientId]
  );

  useEffect(() => {
    if (enabled && patientId != null) {
      loadRecords();
    }
  }, [enabled, patientId, loadRecords]);

  const latestRecord = useMemo(() => {
    if (records.length === 0) return null;
    return [...records].sort((a, b) => b.id - a.id)[0];
  }, [records]);

  return {
    records,
    loading,
    refreshing,
    error,
    latestRecord,
    loadRecords,
  };
}
