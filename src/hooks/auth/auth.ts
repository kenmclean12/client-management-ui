import { useMutation } from "@tanstack/react-query";
import { post } from "../../lib/api";
import type { TokenResponseDto, UserCreateDto } from "../../types";

export function useAuthRegister() {
  return useMutation({
    mutationFn: (dto: UserCreateDto) =>
      post<TokenResponseDto>("/auth/register", dto),
  });
}
