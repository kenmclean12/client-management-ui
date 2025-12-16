export interface NoteCreateDto {
  content: string;
  clientId: number;
  userId: number;
  projectId?: number | null;
  jobId?: number | null;
}
