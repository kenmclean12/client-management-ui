import { UserUpdateDto } from "../../../types";

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
