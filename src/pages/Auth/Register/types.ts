import { UserCreateDto } from "../../../types";

export enum Step {
  One = 1,
  Two = 2,
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  age?: string;
  email?: string;
  userName?: string;
  password?: string;
  phoneNumber?: string;
  description?: string;
}

export type StepField = {
  key: keyof UserCreateDto;
  placeholder: string;
  type?: string;
};
