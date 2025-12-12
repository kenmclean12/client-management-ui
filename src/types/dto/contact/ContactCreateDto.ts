export interface ContactCreateDto {
  name: string;
  email: string;
  clientId: number;
  phone: string | null;
}