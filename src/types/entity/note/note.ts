import { User } from "../user";

export interface Note {
  id: number;
  content: string;
  clientId: number;
  userId: number;
  user?: User;
  projectId: number | null;
  jobId: number | null;
  createdAt: string;
  updatedAt: string | null;
}
