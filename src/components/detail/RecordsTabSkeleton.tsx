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

export function RecordsTabSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Cargando expediente">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SkeletonBar className="h-4 w-56" />
        <SkeletonBar className="h-8 w-24" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="rounded-lg shadow-sm">
          <CardContent className="space-y-3 p-4">
            <SkeletonBar className="h-5 w-40" />
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-5/6" />
            <SkeletonBar className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
