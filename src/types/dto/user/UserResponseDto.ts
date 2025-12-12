import { UserRole } from "../../entity";

export interface UserResponseDto {
  id: number;
  userName: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string | null;
}
