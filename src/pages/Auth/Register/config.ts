import { Step, StepField } from "./types";

export const stepFields: Record<Step, StepField[]> = {
  [Step.One]: [
    { key: "email", placeholder: "Email" },
    { key: "firstName", placeholder: "First Name" },
    { key: "lastName", placeholder: "Last Name" },
  ],
  [Step.Two]: [
    { key: "userName", placeholder: "Username" },
    { key: "password", placeholder: "Password", type: "password" },
  ],
};

export const validations: Record<Step, string[]> = {
  [Step.One]: [
    "firstName|required",
    "lastName|required",
    "email|required|email",
  ],
  [Step.Two]: ["userName|required", "password|required"],
};
