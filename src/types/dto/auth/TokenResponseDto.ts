import { UserResponseDto } from "../user";

export interface TokenResponseDto {
  token: string;
  user: UserResponseDto;
}
