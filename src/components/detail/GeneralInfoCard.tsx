import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ContactItem {
  type: "phone" | "email" | "address" | "bloodType" | "other";
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface GeneralInfoCardProps {
  fullName: string;
  id?: string | number;
  age?: string;
  status?: "active" | "inactive";
  statusLabel?: string;
  avatar?: React.ReactNode;
  contactItems?: ContactItem[];
  emergencyContact?: EmergencyContact;
  className?: string;
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconLocation({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconDroplet({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function DefaultIcon({ type }: { type: ContactItem["type"] }) {
  const c = "h-4 w-4 shrink-0 text-muted-foreground";
  switch (type) {
    case "phone": return <IconPhone className={c} />;
    case "email": return <IconMail className={c} />;
    case "address": return <IconLocation className={c} />;
    case "bloodType": return <IconDroplet className={c} />;
    default: return <span className={c} />;
  }
}

export function GeneralInfoCard({
  fullName,
  id,
  age,
  status = "active",
  statusLabel,
  avatar,
  contactItems = [],
  emergencyContact,
  className,
}: GeneralInfoCardProps) {
  const statusText = statusLabel ?? (status === "active" ? "Activo" : "Inactivo");

  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {avatar ?? (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground">
              {fullName.charAt(0)}
            </div>
          )}
          <h2 className="mt-3 text-lg font-semibold text-foreground">{fullName}</h2>
          {(id != null || age) && (
            <p className="mt-1 text-sm text-muted-foreground">
              {id != null && <>ID: #{id}</>}
              {id != null && age && " • "}
              {age != null && <>{age} años</>}
            </p>
          )}
          <span
            className={cn(
              "mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
              status === "active"
                ? "bg-success text-success-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {statusText}
          </span>
        </div>

        {contactItems.length > 0 && (
          <div className="mt-6 space-y-3 border-t pt-4">
            {contactItems.map((item, i) => (
              <div key={i} className="flex gap-3">
                {item.icon ?? <DefaultIcon type={item.type} />}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="truncate text-sm text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {emergencyContact && (
          <div className="mt-4 rounded-lg bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
                <path d="M12 2L2 12l3 3 7-7 7 7 3-3L12 2z" />
              </svg>
              Contacto de Emergencia
            </div>
            <p className="mt-1 text-sm text-foreground">
              {emergencyContact.name} ({emergencyContact.relation})
            </p>
            <p className="text-sm text-muted-foreground">{emergencyContact.phone}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
