import { UserResponseDto, UserUpdateDto } from "../../../types";

export const userTextFields: {
  key: keyof Pick<
    UserUpdateDto,
    "firstName" | "lastName" | "userName" | "email"
  >;
  label: string;
}[] = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "userName", label: "Username" },
  { key: "email", label: "Email" },
];

export const createUserForm = (user: UserResponseDto): UserUpdateDto => ({
  userName: user?.userName ?? "",
  email: user?.email ?? "",
  firstName: user?.firstName ?? "",
  lastName: user?.lastName ?? "",
  role: user?.role,
  avatarUrl: user?.avatarUrl ?? "",
});
