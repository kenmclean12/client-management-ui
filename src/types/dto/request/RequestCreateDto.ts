import { RequestPriority } from "../../entity";

export interface RequestCreateDto {
  title: string;
  description: string;
  clientId: number;
  priority: RequestPriority;
}
