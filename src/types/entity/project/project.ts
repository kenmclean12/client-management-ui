import { UserResponseDto } from "../../dto";
import { Client } from "../client";
import { Job } from "../job";
import { RequestPriority } from "../request";
import { ProjectStatus } from "./ProjectStatus";

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  clientId: number;
  startDate: string;
  endDate?: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt?: string | null;
  assignedUserId: number | null;
  projectPriority: RequestPriority;
  projectStatus: ProjectStatus;

  client?: Client;
  assignedUser?: UserResponseDto;
  jobs?: Job[];
}
