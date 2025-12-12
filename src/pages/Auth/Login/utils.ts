import { LoginRequestDto } from "../../../types";

export function validateLogin(form: LoginRequestDto) {
  const { email, password } = form;

  if (!email.trim()) return { field: "email", message: "Email is required" };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim()))
    return { field: "email", message: "Please enter a valid email address" };

  if (!password.trim())
    return { field: "password", message: "Password is required" };

  return null;
}
