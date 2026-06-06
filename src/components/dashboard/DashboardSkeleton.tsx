import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      aria-hidden
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <SkeletonBar className="h-8 w-36" />
        <SkeletonBar className="h-8 w-32" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="rounded-lg shadow-sm">
            <CardContent className="space-y-3 p-6">
              <SkeletonBar className="h-10 w-10 rounded-lg" />
              <SkeletonBar className="h-3 w-24" />
              <SkeletonBar className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="rounded-lg shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between pb-3">
              <SkeletonBar className="h-5 w-36" />
              <SkeletonBar className="h-4 w-28" />
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {Array.from({ length: 3 }).map((__, row) => (
                <SkeletonBar key={row} className="h-12 w-full rounded-lg" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
