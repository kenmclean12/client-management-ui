export interface Client {
  id: number;
  name: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string | null;
}
