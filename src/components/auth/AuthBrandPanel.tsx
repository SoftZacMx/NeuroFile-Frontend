export function AuthBrandPanel() {
  return (
    <div className="bg-muted/40 flex flex-col items-center justify-center p-8 md:p-12">
      <img
        src="/NeuroFileLogo.png"
        alt="NeuroFile"
        className="w-32 h-32 md:w-80 md:h-80 object-contain mb-6"
      />
      <h2 className="text-xl md:text-2xl font-bold text-foreground text-center">
        Plataforma Integral De Gestión Clínica
      </h2>
      <p className="text-sm text-muted-foreground text-center mt-2 max-w-sm">
        Eficiencia y precisión en la gestión de expedientes clínicos.
      </p>
    </div>
  );
}
