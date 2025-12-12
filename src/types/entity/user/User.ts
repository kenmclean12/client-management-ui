import { UserRole } from "./UserRole";

export interface User {
  id: number;
  userName: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string | null;
}
