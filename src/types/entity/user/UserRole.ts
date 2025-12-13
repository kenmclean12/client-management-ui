export enum UserRole {
  ReadOnly = 1,
  Standard = 2,
  Admin = 3,
}

export const UserRoleLabel: Record<UserRole, string> = {
  [UserRole.ReadOnly]: "Read-only",
  [UserRole.Standard]: "Standard",
  [UserRole.Admin]: "Admin",
};
