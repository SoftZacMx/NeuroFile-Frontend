import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getPatients } from "@/services/patients";
import { createExpedient } from "@/services/expedients";
import { ExpedientForm } from "@/components/expedient/ExpedientForm";
import type { Patient } from "@/types/patient";
import type { ExpedientFormState } from "@/types/expedient";

export default function CreateExpedient() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

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
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  const handleSubmit = useCallback(
    async (payload: ExpedientFormState) => {
      await createExpedient(api, payload);
      toast.success("Expediente creado correctamente.");
      navigate("/patients", { replace: true });
    },
    [api, navigate]
  );

  if (loading) {
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
      />
    </div>
  );
}
