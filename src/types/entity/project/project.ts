import { UserResponseDto } from "../../dto";
import { Client } from "../client";
import { Job } from "../job";

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  clientId: number;
  startDate: string;
  endDate?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  assignedUserId: string | null;

  client?: Client;
  assignedUser?: UserResponseDto;
  jobs?: Job[];
}
