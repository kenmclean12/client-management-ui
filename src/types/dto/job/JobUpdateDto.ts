import { JobPriority, JobStatus } from "../../entity";

export interface JobUpdateDto {
  name?: string;
  description?: string;

  clientId?: number;
  projectId?: number | null;

  status?: JobStatus;
  priority?: JobPriority;

  dueDate?: string;
  estimatedFinish?: string | null;
  completedAt?: string | null;
}
