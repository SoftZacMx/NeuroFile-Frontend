import { cn } from "@/lib/utils";

function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      aria-hidden
    />
  );
}

export function NotesTabSkeleton({ label = "Cargando notas…" }: { label?: string }) {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label={label}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SkeletonBar className="h-4 w-48" />
        <SkeletonBar className="h-8 w-28" />
      </div>
      <div className="relative space-y-6 pl-4">
        <div className="absolute left-[5px] top-0 h-full w-px bg-muted" aria-hidden />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-2 pl-4">
            <SkeletonBar className="h-3 w-24" />
            <SkeletonBar className="h-16 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
