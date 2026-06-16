import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      aria-hidden
    />
  );
}

export function PatientDetailSkeleton() {
  return (
    <div
      className="flex flex-col p-6 lg:flex-row lg:gap-12"
      aria-busy="true"
      aria-label="Cargando paciente"
    >
      <div className="flex shrink-0 flex-col gap-4 lg:w-72">
        <div className="flex items-center gap-2">
          <SkeletonBar className="h-4 w-16" />
          <SkeletonBar className="h-4 w-2" />
          <SkeletonBar className="h-4 w-32" />
        </div>
        <div className="flex gap-2 lg:flex-col">
          <SkeletonBar className="h-8 flex-1 lg:w-full" />
          <SkeletonBar className="h-8 flex-1 lg:w-full" />
        </div>
        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <SkeletonBar className="h-24 w-24 rounded-full" />
              <SkeletonBar className="mt-3 h-5 w-40" />
              <SkeletonBar className="mt-2 h-4 w-16" />
              <SkeletonBar className="mt-2 h-5 w-14 rounded-full" />
            </div>
            <div className="mt-6 space-y-3 border-t pt-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <SkeletonBar className="h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <SkeletonBar className="h-3 w-20" />
                    <SkeletonBar className="h-4 w-full max-w-[180px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="min-w-0 flex-1 pt-4 lg:pt-0 lg:pl-2">
        <div className="flex gap-2 border-b border-border pb-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBar key={index} className="h-8 w-20" />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SkeletonBar className="h-28 w-full rounded-lg" />
          <SkeletonBar className="h-28 w-full rounded-lg" />
        </div>
        <SkeletonBar className="mt-8 h-5 w-36" />
        <div className="mt-4 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonBar key={index} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
