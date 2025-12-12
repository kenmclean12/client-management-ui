import { Client } from "../client";

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  clientId: number;
  startDate: string;
  endDate?: string | null;
  createdAt: string;
  updatedAt?: string | null;

  client?: Client;
  jobs?: Job[];
}