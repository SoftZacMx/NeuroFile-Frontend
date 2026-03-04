import { cn } from "@/lib/utils";

export interface DataListColumn {
  key: string;
  label: string;
  /** Optional class for the th (e.g. width) */
  className?: string;
}

export interface DataListProps<T> {
  columns: DataListColumn[];
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

export function DataList<T>({
  columns,
  items,
  renderItem,
  keyExtractor,
  emptyMessage = "No hay registros.",
  loading = false,
  className,
}: DataListProps<T>) {
  return (
    <div className={cn("rounded-md border border-border", className)}>
      <table className="w-full table-fixed text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 font-medium uppercase tracking-wide text-muted-foreground",
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                Cargando…
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={keyExtractor(item)} className="border-b border-border last:border-0">
                {renderItem(item)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
