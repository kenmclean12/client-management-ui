export interface Note {
  id: number;
  content: string;
  clientId: number;
  projectId: number | null;
  jobId: number | null;
  createdAt: string;
  updatedAt: string | null;
}
