import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type StatusFilterValue = "all" | "active" | "inactive";

export interface ListToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  statusFilter: StatusFilterValue;
  onStatusFilterChange: (value: StatusFilterValue) => void;
  className?: string;
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function ListToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar…",
  statusFilter,
  onStatusFilterChange,
  className,
}: ListToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4",
        className
      )}
    >
      <div className="relative flex-1">
        <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          type="button"
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusFilterChange("all")}
        >
          Todos
        </Button>
        <Button
          type="button"
          variant={statusFilter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusFilterChange("active")}
        >
          Activos
        </Button>
        <Button
          type="button"
          variant={statusFilter === "inactive" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusFilterChange("inactive")}
        >
          Inactivos
        </Button>
      </div>
    </div>
  );
}
