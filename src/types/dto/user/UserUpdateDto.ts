import { UserRole } from "../../entity";

export interface UserUpdateDto {
  userName: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: UserRole | null;
  avatarUrl: string | null;
}
