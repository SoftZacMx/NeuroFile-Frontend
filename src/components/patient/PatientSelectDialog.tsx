import { useMemo, useState } from "react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ListToolbar, type StatusFilterValue } from "@/components/common/ListToolbar";
import { DataList } from "@/components/common/DataList";
import { PatientSelectListItem } from "./PatientSelectListItem";
import type { Patient } from "@/types/patient";

const COLUMNS = [
  { key: "patient", label: "Paciente", className: "w-[min(200px,30%)]" },
  { key: "id", label: "ID", className: "w-[80px]" },
  { key: "status", label: "Estado", className: "w-[100px]" },
  { key: "action", label: "Acción", className: "w-[120px]" },
];

export interface PatientSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patients: Patient[];
  onSelect: (patient: Patient) => void;
}

function fullName(p: Patient): string {
  return [p.first_name, p.last_name, p.second_last_name]
    .filter(Boolean)
    .join(" ");
}

export function PatientSelectDialog({
  open,
  onOpenChange,
  patients,
  onSelect,
}: PatientSelectDialogProps) {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");

  const filteredPatients = useMemo(() => {
    let list = patients;
    if (statusFilter === "active") list = list.filter((p) => p.is_active);
    if (statusFilter === "inactive") list = list.filter((p) => !p.is_active);
    if (searchValue.trim()) {
      const q = searchValue.trim().toLowerCase();
      list = list.filter(
        (p) =>
          fullName(p).toLowerCase().includes(q) ||
          String(p.id).toLowerCase().includes(q) ||
          p.phone?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [patients, statusFilter, searchValue]);

  const handleSelect = (patient: Patient) => {
    onSelect(patient);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay>
          <DialogContent className="max-h-[90vh] max-w-2xl flex flex-col">
            <DialogHeader>
              <DialogTitle>Seleccionar paciente</DialogTitle>
              <DialogDescription>
                Elija el paciente para el cual desea crear el expediente clínico.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-1 flex-col gap-4 overflow-hidden px-6 pb-6">
              <ListToolbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Buscar por nombre, ID o teléfono…"
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
              <div className="min-h-0 flex-1 overflow-auto">
                <DataList<Patient>
                  columns={COLUMNS}
                  items={filteredPatients}
                  keyExtractor={(p) => p.id}
                  renderItem={(patient) => (
                    <PatientSelectListItem
                      patient={patient}
                      onSelect={handleSelect}
                    />
                  )}
                  emptyMessage="No hay pacientes que coincidan con los filtros."
                />
              </div>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
