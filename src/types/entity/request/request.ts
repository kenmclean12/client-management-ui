import { Client } from "../client";
import { RequestPriority } from "./RequestPriority";
import { RequestStatus } from "./RequestStatus";

export interface Request {
  id: number;
  title: string;
  description: string;
  clientId: number;
  client: Client;
  status: RequestStatus;
  priority: RequestPriority;
  projectId: number | null;
  createdAt: string;
  reviewedAt: string | null;
}
