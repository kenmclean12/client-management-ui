import { RequestStatus } from "../../entity";

export interface RequestUpdateDto {
  title: string | null;
  description: string | null;
  priority: RequestPriority | null;
  status: RequestStatus | null;
  projectId: number | null;
  jobId: number | null;
}
