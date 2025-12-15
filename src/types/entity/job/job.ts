import { UserResponseDto } from "../../dto";
import { Client } from "../client";
import { JobPriority } from "./JobPriority";
import { JobStatus } from "./JobStatus";

export interface Job {
  id: number;
  name: string;
  description: string;
  clientId: number;
  assignedUserId: number | null;
  projectId?: number | null;
  status: JobStatus;
  priority: JobPriority;
  dueDate: string;
  estimatedFinish?: string | null;

  client?: Client;
  assignedUser?: UserResponseDto;

  createdAt: string;
  updatedAt?: string | null;
  completedAt?: string | null;
}
