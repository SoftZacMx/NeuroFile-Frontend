import { Button } from "@/components/ui/button";

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

export interface RecordingOverlayProps {
  /** Se invoca al pulsar "Terminar grabación". Debe llamar al API y cerrar el overlay. */
  onEndRecording: () => Promise<void>;
  /** Mientras es true, el botón se muestra deshabilitado (evita doble clic). */
  isEnding?: boolean;
}

export function RecordingOverlay({
  onEndRecording,
  isEnding = false,
}: RecordingOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95"
      role="dialog"
      aria-modal="true"
      aria-label="Grabación en curso"
    >
      {/* Círculos animados simulando recepción de audio */}
      <div className="relative flex h-48 w-48 shrink-0 items-center justify-center md:h-56 md:w-56">
        {/* Anillo exterior: se expande y contrae */}
        <div
          className="absolute inset-0 rounded-full bg-blue-400/40 animate-audio-pulse"
          aria-hidden
        />
        {/* Segundo anillo, desfasado */}
        <div
          className="absolute inset-0 rounded-full bg-blue-300/50 animate-audio-pulse [animation-delay:0.4s]"
          aria-hidden
        />
        {/* Círculo interior sólido con micrófono */}
        <div
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-blue-500 md:h-28 md:w-28"
          aria-hidden
        >
          <MicIcon className="h-10 w-10 text-white md:h-12 md:w-12" />
        </div>
      </div>
      <Button
        variant="destructive"
        size="lg"
        className="mt-6"
        onClick={() => void onEndRecording()}
        disabled={isEnding}
      >
        {isEnding ? "Finalizando…" : "Terminar grabación"}
      </Button>
    </div>
  );
}
