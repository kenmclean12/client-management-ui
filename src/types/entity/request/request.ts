import { RequestStatus } from "./RequestStatus";

export interface Request {
  id: number;
  title: string;
  description: string;
  clientId: number;
  status: RequestStatus;
  priority: RequestPriority;
  projectId: number | null;
  jobId: number | null;
  createdAt: string;
  reviewedAt: string | null;
}
