import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import {
  getPatients,
  deletePatient,
  createPatient,
  type CreatePatientPayload,
  type PatientUpdatePayload,
} from "@/services/patients";
import type { Patient } from "@/types/patient";
import { ComponentHeader } from "@/components/common/ComponentHeader";
import { ListToolbar, type StatusFilterValue } from "@/components/common/ListToolbar";
import { DataList } from "@/components/common/DataList";
import { Pagination } from "@/components/common/Pagination";
import { PatientListItem } from "@/components/patient/PatientListItem";
import { CreatePatientDialog } from "@/components/patient/CreatePatientDialog";
import { PacientesEmptyState } from "@/components/empty-state/PacientesEmptyState";
import { Button } from "@/components/ui/button";

function IconUserPlus() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

const PAGE_SIZE = 10;
const PATIENT_COLUMNS = [
  { key: "patient", label: "Paciente", className: "w-[min(200px,30%)]" },
  { key: "id", label: "ID / DNI", className: "w-[100px]" },
  { key: "last_appointment", label: "Última cita", className: "w-[140px]" },
  { key: "status", label: "Estado", className: "w-[100px]" },
  { key: "actions", label: "Acciones", className: "w-[120px]" },
];

export default function Patients() {
  const { api, user } = useAuth();
  const confirmDialog = useConfirmDialog();
  const [patients, setPatients] = useState<Patient[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPatients(api);
      setPatients(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar pacientes");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const fullName = (p: Patient) =>
    [p.first_name, p.last_name, p.second_last_name].filter(Boolean).join(" ");

  const filteredPatients = useMemo(() => {
    if (!patients) return [];
    let list = patients;
    if (statusFilter === "active") list = list.filter((p) => p.is_active);
    if (statusFilter === "inactive") list = list.filter((p) => !p.is_active);
    if (searchValue.trim()) {
      const q = searchValue.trim().toLowerCase();
      list = list.filter((p) => {
        const name = [p.first_name, p.last_name, p.second_last_name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return (
          name.includes(q) ||
          String(p.id).toLowerCase().includes(q) ||
          p.phone?.toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [patients, statusFilter, searchValue]);

  const paginatedPatients = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPatients.slice(start, start + PAGE_SIZE);
  }, [filteredPatients, page]);

  useEffect(() => {
    setPage(1);
  }, [searchValue, statusFilter]);

  const handleCreatePatient = useCallback(
    async (payload: PatientUpdatePayload) => {
      if (!user?.id) throw new Error("Usuario no autenticado");
      const fullPayload: CreatePatientPayload = {
        ...payload,
        user_id: user.id,
      };
      return createPatient(api, fullPayload);
    },
    [api, user?.id]
  );

  const handleDelete = useCallback(
    async (patient: Patient) => {
      const ok = await confirmDialog({
        title: "Confirmar eliminación",
        message: `¿Eliminar a ${fullName(patient)}?`,
        confirmLabel: "Eliminar",
        cancelLabel: "Cancelar",
        variant: "destructive",
      });
      if (!ok) return;
      setDeletingId(patient.id);
      try {
        await deletePatient(api, patient.id);
        setPatients((prev) => (prev ?? []).filter((p) => p.id !== patient.id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al eliminar");
      } finally {
        setDeletingId(null);
      }
    },
    [api, confirmDialog]
  );

  if (loading && !patients?.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <p className="text-muted-foreground">Cargando pacientes…</p>
      </div>
    );
  }

  if (error && !patients?.length) {
    return (
      <div className="p-6">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" className="mt-2" onClick={loadPatients}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (!patients?.length) {
    return (
      <>
        <PacientesEmptyState
          primaryAction={{
            label: "Agregar paciente",
            icon: <IconUserPlus />,
            onClick: () => setCreateDialogOpen(true),
          }}
        />
        <CreatePatientDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          createPatient={handleCreatePatient}
          onSuccess={() => {
            setCreateDialogOpen(false);
            loadPatients();
          }}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <ComponentHeader
        title="Listado de Pacientes"
        description="Gestiona la información clínica y el seguimiento de tus pacientes registrados en la plataforma."
        actions={
          <Button onClick={() => setCreateDialogOpen(true)}>
            <IconUserPlus className="mr-2 h-4 w-4" />
            Crear paciente
          </Button>
        }
      />

      <CreatePatientDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        createPatient={handleCreatePatient}
        onSuccess={() => {
          setCreateDialogOpen(false);
          loadPatients();
        }}
      />

      <ListToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Buscar por nombre, DNI o número de historial…"
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <DataList<Patient>
        columns={PATIENT_COLUMNS}
        items={paginatedPatients}
        keyExtractor={(p) => p.id}
        renderItem={(patient) => (
          <PatientListItem
            patient={patient}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
        emptyMessage="No hay pacientes que coincidan con los filtros."
        loading={loading}
      />

      <Pagination
        total={filteredPatients.length}
        pageSize={PAGE_SIZE}
        page={page}
        onPageChange={setPage}
        itemLabel="pacientes"
      />
    </div>
  );
}
