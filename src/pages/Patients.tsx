import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import {
  getPatients,
  createPatient,
  updatePatient,
  type CreatePatientPayload,
  type PatientUpdatePayload,
} from "@/services/patients";
import { patientToUpdatePayload } from "@/components/patient/patientFormUtils";
import type { Patient } from "@/types/patient";
import { ComponentHeader } from "@/components/common/ComponentHeader";
import {
  ListToolbar,
  type StatusFilterValue,
} from "@/components/common/ListToolbar";
import { DataList } from "@/components/common/DataList";
import { Pagination } from "@/components/common/Pagination";
import { PatientListItem } from "@/components/patient/PatientListItem";
import { CreatePatientDialog } from "@/components/patient/CreatePatientDialog";
import { EditPatientDialog } from "@/components/patient/EditPatientDialog";
import { PacientesEmptyState } from "@/components/empty-state/PacientesEmptyState";
import { Button } from "@/components/ui/button";

function IconUserPlus({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
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
  { key: "id", label: "ID", className: "w-[72px]" },
  { key: "patient", label: "Paciente", className: "w-[min(200px,28%)]" },
  { key: "phone", label: "Teléfono", className: "w-[130px]" },
  { key: "last_appointment", label: "Última cita", className: "w-[130px]" },
  { key: "status", label: "Estado", className: "w-[100px]" },
  { key: "actions", label: "Acciones", className: "w-[140px]" },
];

function parseStatusFilter(value: string | null): StatusFilterValue {
  if (value === "active" || value === "inactive") return value;
  return "all";
}

function patientFullName(p: Patient): string {
  return [p.first_name, p.last_name, p.second_last_name]
    .filter(Boolean)
    .join(" ");
}

export default function Patients() {
  const { api, user } = useAuth();
  const navigate = useNavigate();
  const confirmDialog = useConfirmDialog();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = parseStatusFilter(searchParams.get("status"));
  const [patients, setPatients] = useState<Patient[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [togglingStatusId, setTogglingStatusId] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

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

  useEffect(() => {
    if (searchParams.get("create") !== "1") return;
    setCreateDialogOpen(true);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("create");
        return next;
      },
      { replace: true },
    );
  }, [searchParams, setSearchParams]);

  const handleStatusFilterChange = useCallback(
    (value: StatusFilterValue) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === "all") next.delete("status");
          else next.set("status", value);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

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
    [api, user?.id],
  );

  const handleUpdatePatient = useCallback(
    async (payload: PatientUpdatePayload) => {
      if (!editingPatient) throw new Error("Paciente no seleccionado");
      return updatePatient(api, editingPatient.id, payload);
    },
    [api, editingPatient],
  );

  const handleToggleActiveStatus = useCallback(
    async (patient: Patient) => {
      const nextIsActive = !patient.is_active;
      const ok = await confirmDialog({
        title: nextIsActive ? "Reactivar paciente" : "Inactivar paciente",
        message: nextIsActive
          ? `¿Reactivar a ${patientFullName(patient)}? Volverá a aparecer como paciente activo.`
          : `¿Inactivar a ${patientFullName(patient)}? Se conservará su historial clínico y dejará de contarse como activo.`,
        confirmLabel: nextIsActive ? "Reactivar" : "Inactivar",
        cancelLabel: "Cancelar",
        variant: nextIsActive ? "default" : "destructive",
      });
      if (!ok) return;

      setTogglingStatusId(patient.id);
      setError(null);
      try {
        const updated = await updatePatient(
          api,
          patient.id,
          patientToUpdatePayload(patient, { is_active: nextIsActive }),
        );
        setPatients((prev) =>
          (prev ?? []).map((item) => (item.id === updated.id ? updated : item)),
        );
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : nextIsActive
              ? "Error al reactivar el paciente"
              : "Error al inactivar el paciente",
        );
      } finally {
        setTogglingStatusId(null);
      }
    },
    [api, confirmDialog],
  );

  const handleEditPatient = useCallback((patient: Patient) => {
    setEditingPatient(patient);
    setEditDialogOpen(true);
  }, []);

  const handlePatientRowClick = useCallback(
    (patient: Patient) => {
      navigate(`/patients/${patient.id}`);
    },
    [navigate],
  );

  const handleEditDialogOpenChange = useCallback((open: boolean) => {
    setEditDialogOpen(open);
    if (!open) setEditingPatient(null);
  }, []);

  const handleEditSuccess = useCallback((updated: Patient) => {
    setPatients((prev) =>
      (prev ?? []).map((patient) =>
        patient.id === updated.id ? updated : patient,
      ),
    );
    setEditDialogOpen(false);
    setEditingPatient(null);
  }, []);

  const createDialog = (
    <CreatePatientDialog
      open={createDialogOpen}
      onOpenChange={setCreateDialogOpen}
      createPatient={handleCreatePatient}
      onSuccess={() => {
        setCreateDialogOpen(false);
        loadPatients();
      }}
    />
  );

  const editDialog = (
    <EditPatientDialog
      open={editDialogOpen}
      onOpenChange={handleEditDialogOpenChange}
      patient={editingPatient}
      updatePatient={handleUpdatePatient}
      onSuccess={handleEditSuccess}
    />
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
        {createDialog}
        {editDialog}
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

      {createDialog}
      {editDialog}

      <ListToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Buscar por nombre, teléfono o ID…"
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <DataList<Patient>
        columns={PATIENT_COLUMNS}
        items={paginatedPatients}
        keyExtractor={(p) => p.id}
        onRowClick={handlePatientRowClick}
        getRowAriaLabel={(patient) =>
          `Ver ficha de ${patientFullName(patient)}`
        }
        renderItem={(patient) => (
          <PatientListItem
            patient={patient}
            onEdit={handleEditPatient}
            onToggleActiveStatus={handleToggleActiveStatus}
            togglingStatusId={togglingStatusId}
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
