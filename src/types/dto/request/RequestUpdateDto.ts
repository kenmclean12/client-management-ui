import { RequestStatus } from "../../entity";

export interface RequestUpdateDto {
  title: string | null;
  description: string | null;
  priority: RequestPriority | null;
  status: RequestStatus | null;
  assignedUserId: number | null;
  dueDate: string | null;
  projectId: number | null;
  jobId: number | null;
}
