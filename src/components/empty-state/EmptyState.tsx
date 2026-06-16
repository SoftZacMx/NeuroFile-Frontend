import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface EmptyStateProps {
  illustration?: React.ReactNode;
  title: string;
  description?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  helpText?: React.ReactNode;
  helpLink?: string;
  helpLinkLabel?: string;
  className?: string;
}

export function EmptyState({
  illustration,
  title,
  description,
  primaryAction,
  secondaryAction,
  helpText,
  helpLink,
  helpLinkLabel = "centro de ayuda",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center px-4 py-12 text-center",
        className
      )}
    >
      {illustration && (
        <div className="mb-6 flex justify-center">{illustration}</div>
      )}
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {primaryAction && (
          <Button
            onClick={primaryAction.onClick}
            className="gap-2"
          >
            {primaryAction.icon}
            {primaryAction.label}
          </Button>
        )}
        {secondaryAction && (
          <Button
            variant="outline"
            onClick={secondaryAction.onClick}
            className="gap-2"
          >
            {secondaryAction.icon}
            {secondaryAction.label}
          </Button>
        )}
      </div>
      {helpText && (
        <p className="mt-8 text-xs text-muted-foreground">
          {helpLink ? (
            <>
              {helpText}{" "}
              <a
                href={helpLink}
                className="text-primary hover:underline"
              >
                {helpLinkLabel}
              </a>
            </>
          ) : (
            helpText
          )}
        </p>
      )}
    </div>
  );
}
