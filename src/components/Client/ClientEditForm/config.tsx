import { Client, ClientUpdateDto } from "../../../types";

export function clientToForm(client: Client): ClientUpdateDto {
  return {
    name: client.name,
    email: client.email,
    phoneNumber: client.phoneNumber,
    address: client.address,
    city: client.city,
    state: client.state,
    zipCode: client.zipCode,
    country: client.country,
    softDeleted: client.softDeleted,
  };
}

export function hasClientChanges(form: ClientUpdateDto, client: Client): boolean {
  return (Object.keys(form) as (keyof ClientUpdateDto)[]).some(
    (key) => form[key] !== client[key]
  );
}

export const emptyForm: ClientUpdateDto = {
  name: "",
  email: "",
  phoneNumber: null,
  address: null,
  city: null,
  state: null,
  zipCode: null,
  country: null,
  softDeleted: null,
};
