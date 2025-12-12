import { UserRole } from "../../entity";

export interface UserCreateDto {
  userName: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl: string | null;
}
