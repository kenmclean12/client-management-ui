import { JobPriority } from "./JobPriority";
import { JobStatus } from "./JobStatus";

export interface Job {
  id: number;
  name: string;
  description: string;

  clientId: number;
  projectId?: number | null;

  status: JobStatus;
  priority: JobPriority;

  dueDate: string;
  estimatedFinish?: string | null;

  createdAt: string;
  updatedAt?: string | null;
  completedAt?: string | null;
}
