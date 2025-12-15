import { ClientCreateDto } from "../../../types";

type ClientFieldConfig = {
  key: keyof ClientCreateDto;
  label: string;
  required?: boolean;
  type?: string;
  autoFocus?: boolean;
};

export const CLIENT_FIELDS: ClientFieldConfig[] = [
  { key: "name", label: "Client Name", required: true, autoFocus: true },
  { key: "email", label: "Email", required: true, type: "email" },
  { key: "phoneNumber", label: "Phone Number" },
  { key: "address", label: "Address" },
];

export const CLIENT_FIELD_ROWS: ClientFieldConfig[][] = [
  [
    { key: "city", label: "City" },
    { key: "state", label: "State" },
  ],
  [
    { key: "zipCode", label: "Zip Code" },
    { key: "country", label: "Country" },
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
