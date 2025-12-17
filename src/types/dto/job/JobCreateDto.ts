import { JobPriority, JobStatus } from "../../entity";

export interface JobCreateDto {
  name: string;
  description: string;
  clientId: number;
  status?: JobStatus;
  priority?: JobPriority;
  assignedUserId?: number;
  dueDate: string;
  projectId?: number | null;
  estimatedFinish?: string | null;
}
