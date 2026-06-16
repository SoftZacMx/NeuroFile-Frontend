import { cn } from "@/lib/utils";

export interface RecordSectionProps {
  number: number;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function RecordSection({
  number,
  title,
  children,
  className,
}: RecordSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <div className="h-8 w-1 shrink-0 rounded-full bg-primary" />
        <h2 className="text-lg font-semibold uppercase tracking-wide text-primary">
          {number}. {title}
        </h2>
      </div>
      <div className="space-y-4 pl-3">{children}</div>
    </section>
  );
}
