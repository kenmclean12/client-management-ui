export interface NoteCreateDto {
  content: string;
  clientId: number;
  projectId: number | null;
  jobId: number | null;
}
