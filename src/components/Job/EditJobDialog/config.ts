import { Job, JobPriority, JobStatus, JobUpdateDto } from "../../../types";

export function jobToForm(job: Job): JobUpdateDto {
  return {
    name: job.name,
    description: job.description,
    status: job.status,
    priority: job.priority,
    assignedUserId: job.assignedUserId ?? undefined,
    dueDate: job.dueDate.slice(0, 10),
  };
}

export const emptyJobForm = {
  name: "",
  description: "",
  status: JobStatus.Stopped,
  priority: JobPriority.Low,
  assignedUserId: undefined,
  dueDate: "",
};
