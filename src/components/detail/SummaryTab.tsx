import { LastActivitySummary } from "./LastActivitySummary";
import { LastClinicalNotes } from "./LastClinicalNotes";

const MOCK_NOTES = [
  {
    doctorName: "Dr. Alejandro Ruiz",
    date: "12 Oct 2023",
    content:
      "Paciente reporta mejoría significativa en la movilidad. Se ajusta dosis de analgésicos. Continúa con terapia física 2 veces por semana. Próxima revisión en 2 semanas.",
  },
  {
    doctorName: "Dr. Alejandro Ruiz",
    date: "28 Sep 2023",
    content:
      "Evaluación inicial post-operatoria. Herida sanando correctamente. Se inicia protocolo de rehabilitación temprana.",
  },
];

export function SummaryTab() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LastActivitySummary
          categoryLabel="PRÓXIMA CITA"
          title="Consulta de Seguimiento"
          dateTime="25 Oct 2023 - 10:00 AM"
        />
        <LastActivitySummary
          categoryLabel="ÚLTIMA NOTA"
          title="Sesión de evaluación inicial"
          dateTime="18 Oct 2023 - 3:30 PM"
        />
      </div>
      <LastClinicalNotes notes={MOCK_NOTES} />
    </div>
  );
}
