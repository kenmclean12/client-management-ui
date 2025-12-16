import { ProjectStatus, RequestPriority } from "../../entity";

export interface ProjectUpdateDto {
  name?: string | null;
  description?: string | null;
  clientId?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  projectPriority?: RequestPriority | null;
  projectStatus?: ProjectStatus | null;
}
