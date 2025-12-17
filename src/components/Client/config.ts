import { ClientCreateDto } from "../../types";

type ClientFieldConfig = {
  key: keyof ClientCreateDto;
  label: string;
  maxLength: number;
  required?: boolean;
  type?: string;
  autoFocus?: boolean;
};

export const CLIENT_FIELDS: ClientFieldConfig[] = [
  {
    key: "name",
    label: "Name",
    maxLength: 50,
    required: true,
    autoFocus: true,
  },
  {
    key: "email",
    label: "Email",
    maxLength: 50,
    required: true,
    type: "email",
  },
  { key: "phoneNumber", maxLength: 50, label: "Phone Number" },
  { key: "address", maxLength: 50, label: "Address" },
];

export const CLIENT_FIELD_ROWS: ClientFieldConfig[][] = [
  [
    { key: "city", maxLength: 20, label: "City" },
    { key: "state", maxLength: 20, label: "State" },
  ],
  [
    { key: "zipCode", maxLength: 6, label: "Zip Code" },
    { key: "country", maxLength: 20, label: "Country" },
  ],
];

export const emptyForm: ClientCreateDto = {
  name: "",
  email: "",
  phoneNumber: null,
  address: null,
  city: null,
  state: null,
  zipCode: null,
  country: null,
};
