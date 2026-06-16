import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getExpedients } from "@/services/expedients";
import type { RecordListItem } from "@/types/expedient";
import { ComponentHeader } from "@/components/common/ComponentHeader";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/common/Pagination";
import { RecordsFilterBar } from "@/components/records/RecordsFilterBar";
import { RecordsTable } from "@/components/records/RecordsTable";

const PAGE_SIZE = 10;

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function oneMonthAgoISO(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
}

export default function Records() {
  const { api } = useAuth();
  const [records, setRecords] = useState<RecordListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState<string>(() => oneMonthAgoISO());
  const [dateTo, setDateTo] = useState<string>(() => todayISO());
  const [page, setPage] = useState(1);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getExpedients(api);
      setRecords(Array.isArray(list) ? (list as RecordListItem[]) : []);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const filteredRecords = useMemo(() => {
    if (!dateFrom && !dateTo) return records;
    return records.filter((r) => {
      const day = r.created_at.slice(0, 10);
      if (dateFrom && day < dateFrom) return false;
      if (dateTo && day > dateTo) return false;
      return true;
    });
  }, [records, dateFrom, dateTo]);

  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRecords.slice(start, start + PAGE_SIZE);
  }, [filteredRecords, page]);

  const handleResetDates = useCallback(() => {
    setDateFrom(oneMonthAgoISO());
    setDateTo(todayISO());
    setPage(1);
  }, []);

  return (
    <div className="flex max-h-[100vh] flex-col gap-4 p-6" data-testid="records-page">
      <ComponentHeader
        title="Listado de Expedientes"
        description="Gestión integral de la historia clínica de tus pacientes."
        actions={
          <Button asChild size="sm">
            <Link to="/records/new" data-testid="records-new-expedient-link">
              <IconPlus className="mr-2 h-4 w-4" />
              Nuevo expediente
            </Link>
          </Button>
        }
      />

      <RecordsFilterBar
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={(v) => {
          setDateFrom(v);
          setPage(1);
        }}
        onDateToChange={(v) => {
          setDateTo(v);
          setPage(1);
        }}
        onResetDates={handleResetDates}
      />

      <RecordsTable
        records={paginatedRecords}
        loading={loading}
        emptyMessage="No hay expedientes. Cree uno con «Nuevo expediente»."
      />

      <Pagination
        total={filteredRecords.length}
        pageSize={PAGE_SIZE}
        page={page}
        onPageChange={setPage}
        itemLabel="expedientes"
      />
    </div>
  );
}

function IconPlus({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
