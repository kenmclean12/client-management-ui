export interface ProjectCreateDto {
  name: string;
  description?: string | null;
  clientId: number;
  startDate: string;
  endDate?: string | null;
}
