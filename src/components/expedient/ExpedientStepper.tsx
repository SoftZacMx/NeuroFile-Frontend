import { cn } from "@/lib/utils";

export interface ExpedientStepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  className?: string;
}

export function ExpedientStepper({
  currentStep,
  totalSteps,
  stepLabels,
  className,
}: ExpedientStepperProps) {
  const progressPercent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Paso {currentStep} de {totalSteps}
        </span>
        <span className="font-medium text-foreground">
          Progreso total {Math.round(progressPercent)}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-4">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          return (
            <div
              key={stepNumber}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors sm:text-sm",
                isCurrent &&
                  "border-primary bg-primary/10 text-primary",
                isCompleted &&
                  "border-primary/50 bg-primary/5 text-muted-foreground",
                !isCurrent &&
                  !isCompleted &&
                  "border-border bg-muted/30 text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  isCurrent && "bg-primary text-primary-foreground",
                  isCompleted && "bg-primary/20 text-primary",
                  !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? "✓" : stepNumber}
              </span>
              <span className="truncate">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
