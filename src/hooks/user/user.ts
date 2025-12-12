import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { UserCreateDto, UserResponseDto, UserUpdateDto } from "../../types";
import { UserPasswordResetDto } from "../../types/dto/user/PasswordResetDto";

export function useUsersGetAll(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api("/user");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch users");
      }
      return res.json() as Promise<UserResponseDto[]>;
    },
    ...options,
  });
}

export function useUsersGetById(
  id: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await api(`/user/${id}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch user");
      }
      return res.json() as Promise<UserResponseDto>;
    },
    ...options,
  });
}

export function useUsersCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UserCreateDto) => {
      const res = await api("/user", {
        method: "POST",
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create user");
      }

      return res.json() as Promise<UserResponseDto>;
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUsersUpdate(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { id: number; dto: UserUpdateDto }) => {
      const res = await api(`/user/${vars.id}`, {
        method: "PUT",
        body: JSON.stringify(vars.dto),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update user");
      }

      return res.json() as Promise<UserResponseDto>;
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users", id] });
    },
  });
}

export function useUsersResetPassword(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { id: number; dto: UserPasswordResetDto }) => {
      const res = await api(`/user/reset-password/${vars.id}`, {
        method: "PUT",
        body: JSON.stringify(vars.dto),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to reset password");
      }

      return res.json() as Promise<UserResponseDto>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user", id] });
    },
  });
}

