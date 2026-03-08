/**
 * Overlay a pantalla completa mientras se procesa la grabación (transcripción + draft).
 * Estilo similar a RecordingOverlay: círculos animados y mensaje centrado.
 */
export function ProcessingOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95"
      role="status"
      aria-live="polite"
      aria-label="Procesando grabación"
    >
      <div className="relative flex h-48 w-48 shrink-0 items-center justify-center md:h-56 md:w-56">
        <div
          className="absolute inset-0 rounded-full bg-primary/30 animate-audio-pulse"
          aria-hidden
        />
        <div
          className="absolute inset-0 rounded-full bg-primary/40 animate-audio-pulse [animation-delay:0.3s]"
          aria-hidden
        />
        <div
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary md:h-28 md:w-28"
          aria-hidden
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
        </div>
      </div>
      <p className="mt-6 text-lg font-medium text-foreground">
        Procesando grabación…
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Transcribiendo y generando el borrador del expediente
      </p>
    </div>
  );
}
