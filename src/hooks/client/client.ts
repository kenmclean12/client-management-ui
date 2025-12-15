import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, del } from "../../lib/api";
import type { Client, ClientCreateDto, ClientUpdateDto } from "../../types";
import { enqueueSnackbar } from "notistack";

export function useClientsGetAll(options?: { enabled?: boolean }) {
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => get<Client[]>("/client"),
    ...options,
  });
}

export function useClientsGetById(id: number) {
  return useQuery<Client>({
    queryKey: ["client", id],
    queryFn: () => get<Client>(`/client/${id}`),
  });
}

export function useClientsCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: ClientCreateDto) => post<Client>("/client", dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      enqueueSnackbar("Client created successfully", {
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

export function useClientsUpdate(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: ClientUpdateDto }) =>
      put<Client>(`/client/${vars.id}`, vars.dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["client", id] });
      enqueueSnackbar("Client updated successfully", {
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

export function useClientsSoftDelete(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => put<Client>(`/client/soft-delete/${id}`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["client", id] });

      enqueueSnackbar("Client archived", {
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
