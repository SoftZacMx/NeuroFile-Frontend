import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface RecordsFilterBarProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onResetDates?: () => void;
  className?: string;
}

export function RecordsFilterBar({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onResetDates,
  className,
}: RecordsFilterBarProps) {
  return (
    <div className={`flex flex-wrap items-end gap-4 ${className ?? ""}`}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="records-date-from" className="text-xs text-muted-foreground">
          Rango de fecha
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="records-date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="w-[140px]"
          />
          <span className="text-muted-foreground">—</span>
          <Input
            id="records-date-to"
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="w-[140px]"
          />
        </div>
      </div>
      {onResetDates && (dateFrom || dateTo) && (
        <Button type="button" variant="ghost" size="sm" onClick={onResetDates}>
          Limpiar fechas
        </Button>
      )}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Terapeuta</Label>
        <Button type="button" variant="outline" size="sm" disabled className="min-w-[140px]">
          Todos
        </Button>
      </div>
    </div>
  );
}
