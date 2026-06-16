import { cn } from "@/lib/utils";

export interface DetailTab {
  id: string;
  label: string;
}

export interface DetailContentTabsProps {
  tabs: DetailTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function DetailContentTabs({
  tabs,
  activeTabId,
  onTabChange,
  children,
  className,
}: DetailContentTabsProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <nav className="border-b border-border" aria-label="Tabs">
        <ul className="flex gap-6">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "border-b-2 pb-3 text-sm font-medium transition-colors",
                  activeTabId === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex-1 py-4">{children}</div>
    </div>
  );
}
