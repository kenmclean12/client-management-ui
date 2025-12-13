import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCreateDto, UserPasswordResetDto, UserResponseDto, UserUpdateDto } from "../../types";
import { get, post, put, del } from "../../lib/api";

export function useUsersGetAll(options?: { enabled?: boolean }) {
  return useQuery<UserResponseDto[]>({
    queryKey: ["users"],
    queryFn: () => get<UserResponseDto[]>("/user"),
    ...options,
  });
}

export function useUsersGetById(id: number, options?: { enabled?: boolean }) {
  return useQuery<UserResponseDto>({
    queryKey: ["user", id],
    queryFn: () => get<UserResponseDto>(`/user/${id}`),
    ...options,
  });
}

export function useUsersCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: UserCreateDto) => post<UserResponseDto>("/user", dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUsersUpdate(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: UserUpdateDto }) =>
      put<UserResponseDto>(`/user/${vars.id}`, vars.dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users", id] }),
  });
}

export function useUsersResetPassword(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: UserPasswordResetDto }) =>
      put<UserResponseDto>(`/user/reset-password/${vars.id}`, vars.dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user", id] }),
  });
}

export function useUsersDelete(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => del<void>(`/user/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user", id] });
    },
  });
}
