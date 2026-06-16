/** Clinical note as returned by API */
export interface ClinicalNote {
  id: number;
  date: string;
  note: string;
  recordId: number;
}

export interface CreateClinicalNotePayload {
  date: string;
  note: string;
  recordId: number;
}

export interface UpdateClinicalNotePayload {
  date?: string;
  note?: string;
}
