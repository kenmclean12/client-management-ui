import { RequestStatus } from "../../entity";

export interface RequestUpdateDto {
  priority: RequestPriority;
  status: RequestStatus | null;
  assignedUserId: number | null;
  dueDate: string | null;
}
