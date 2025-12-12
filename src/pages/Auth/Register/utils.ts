import { Step, FormErrors } from "./types";
import { validations } from "./config";
import { UserCreateDto } from "../../../types";

export const nextStep = (s: Step): Step => Math.min(s + 1, Step.Two);
export const previousStep = (s: Step): Step => Math.max(s - 1, Step.One);

export const update = <K extends keyof UserCreateDto>(
  key: K,
  value: UserCreateDto[K],
  setForm: React.Dispatch<React.SetStateAction<UserCreateDto>>
) => {
  setForm((prev) => ({ ...prev, [key]: value }));
};

export function validateStep(
  step: Step,
  form: UserCreateDto
): FormErrors | null {
  const rules = validations[step];
  const errors: FormErrors = {};

  for (const rule of rules) {
    const [field, ...checks] = rule.split("|");
    const value = form[field as keyof UserCreateDto];

    for (const check of checks) {
      if (check === "required" && !value)
        errors[field as keyof FormErrors] = `${field} is required`;
      if (
        check === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
      )
        errors[field as keyof FormErrors] = "Please enter a valid email";
    }
  }

  return Object.keys(errors).length ? errors : null;
}
