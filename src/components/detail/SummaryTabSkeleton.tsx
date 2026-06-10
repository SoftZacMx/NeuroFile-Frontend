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

export function SummaryTabSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-label="Cargando resumen">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="rounded-lg shadow-sm">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center gap-2">
                <SkeletonBar className="h-8 w-8 rounded-md" />
                <SkeletonBar className="h-3 w-24" />
              </div>
              <SkeletonBar className="h-5 w-32" />
              <SkeletonBar className="h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-4">
        <SkeletonBar className="h-6 w-36" />
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBar key={index} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
