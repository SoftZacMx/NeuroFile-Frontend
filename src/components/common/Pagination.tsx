import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  /** Total number of items */
  total: number;
  /** Items per page */
  pageSize: number;
  /** Current page (1-based) */
  page: number;
  onPageChange: (page: number) => void;
  /** Label for the entity (e.g. "pacientes") */
  itemLabel?: string;
  className?: string;
}

function IconChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function Pagination({
  total,
  pageSize,
  page,
  onPageChange,
  itemLabel = "registros",
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  /** Show at most 5 page numbers around current */
  const getPageNumbers = () => {
    const pages: number[] = [];
    let from = Math.max(1, page - 2);
    let to = Math.min(totalPages, from + 4);
    if (to - from < 4) from = Math.max(1, to - 4);
    for (let i = from; i <= to; i++) pages.push(i);
    return pages;
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        Mostrando {start}-{end} de {total} {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          aria-label="Página anterior"
        >
          <IconChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p) => (
            <Button
              key={p}
              type="button"
              variant={p === page ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(p)}
              aria-label={`Página ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Página siguiente"
        >
          <IconChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
