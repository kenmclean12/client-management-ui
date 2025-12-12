import { useMutation } from "@tanstack/react-query";
import { post } from "../../lib/api";
import type {
  LoginRequestDto,
  TokenResponseDto,
  UserCreateDto,
} from "../../types";

export function useAuthLogin() {
  return useMutation({
    mutationFn: (dto: LoginRequestDto) =>
      post<TokenResponseDto>("/auth/login", dto),
  });
}

export function useAuthRegister() {
  return useMutation({
    mutationFn: (dto: UserCreateDto) =>
      post<TokenResponseDto>("/auth/register", dto),
  });
}
