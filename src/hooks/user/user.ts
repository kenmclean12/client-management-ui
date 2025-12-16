import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  UserInviteCreateDto,
  UserInviteResponseDto,
  UserPasswordResetDto,
  UserResponseDto,
  UserUpdateDto,
} from "../../types";
import { get, post, put, del } from "../../lib/api";

export function useUsersGetAll(options?: { enabled?: boolean }) {
  return useQuery<UserResponseDto[]>({
    queryKey: ["users"],
    queryFn: () => get<UserResponseDto[]>("/user"),
    ...options,
  });
}

export function useUsersGetAllAdmins(options?: { enabled?: boolean }) {
  return useQuery<UserResponseDto[]>({
    queryKey: ["users"],
    queryFn: () => get<UserResponseDto[]>("/user/admin"),
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

export function useUsersInvite() {
  return useMutation({
    mutationFn: (dto: UserInviteCreateDto) =>
      post<UserInviteResponseDto>("/user/invite-user", dto),
    onSuccess: () => {
      enqueueSnackbar("User invite sent successfully", {
        variant: "success",
      });
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
}

export function useUsersUpdate(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: UserUpdateDto }) =>
      put<UserResponseDto>(`/user/${vars.id}`, vars.dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user", id] });
      enqueueSnackbar("User updated successfully", {
        variant: "success",
      });
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
}

export function useUsersResetPassword(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: UserPasswordResetDto }) =>
      put<UserResponseDto>(`/user/reset-password/${vars.id}`, vars.dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user", id] });
      enqueueSnackbar("Password reset successfully", {
        variant: "success",
      });
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
}

export function useUsersDelete(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => del<void>(`/user/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user", id] });
      enqueueSnackbar("User deleted", {
        variant: "success",
      });
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
}
